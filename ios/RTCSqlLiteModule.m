//
//  RTCSqlLiteModule.m
//  AwesomeProject
//
//  Created by Ryan Conigliaro on 4/16/22.
//

#import "RCTSqlLiteModule.h"
#import <React/RCTLog.h>
#include <sqlite3.h>

#define DB_NAME @"bible.db"

@implementation RCTSqlLiteModule

// To export a module named RCTSqlLiteModule
RCT_EXPORT_MODULE();

sqlite3 *database = NULL;

RCT_EXPORT_METHOD(getVersesByOrder:(NSString*) langCodeLearn
                  langCodeReference:(NSString*) langCodeReference
                  bookNumber:(NSInteger)bookNumber
                  chapterNumber:(NSInteger)chapterNumber
                  verseNumber:(NSInteger)verseNumber
    resolver:(RCTPromiseResolveBlock)resolve
    rejecter:(RCTPromiseRejectBlock)reject)
{
 
  if ([self lazyOpenDB] == false) {
    reject(@"db error", @"Error opening database", nil);
  }
  
  NSString *sql = [NSString stringWithFormat:@"select v.text, bb.lang from verse v, chapter c, book b, bible bb where bb.lang in ('%@','%@') and b.bible_id = bb.id and c.book_id = b.id and v.chapter_id = c.id and v.number=%ld and c.number=%ld and b.number=%ld", langCodeLearn, langCodeReference, verseNumber, chapterNumber, bookNumber];
  
  sqlite3_stmt *stmt = NULL;
  
  RCTLogInfo(@"Running a query %s", [sql UTF8String]);
  
  if (sqlite3_prepare_v2(database, [sql UTF8String], -1, &stmt , NULL) != SQLITE_OK) {
    RCTLogInfo(@"Error: failed to prepare query statement with message '%s'.", sqlite3_errmsg(database));
    reject(@"db error", @"Error querying database", nil);
    return;
  }
  
  NSMutableDictionary *verses = [[NSMutableDictionary alloc] init];
  int row_count = 0;
  while (sqlite3_step(stmt) == SQLITE_ROW) {
    NSString *value = [[NSString alloc] initWithUTF8String: (char*) sqlite3_column_text(stmt, 0)];
    NSString *key = [[NSString alloc] initWithUTF8String: (char*) sqlite3_column_text(stmt, 1)];
    [verses setValue:value forKey:key];
    row_count++;
  }
  
  stmt = NULL;
  sqlite3_finalize(stmt);
  resolve(verses);
  RCTLogInfo(@"Completed query with row count %d", row_count);
}

RCT_EXPORT_METHOD(getLanguages: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if ([self lazyOpenDB] == false) {
    reject(@"db error", @"Error opening database", nil);
  }
 
  NSString *sql = @"select distinct(lang) from bible";
  sqlite3_stmt *stmt = NULL;
  
  RCTLogInfo(@"Running a query %s", [sql UTF8String]);
  
  if (sqlite3_prepare_v2(database, [sql UTF8String], -1, &stmt , NULL) != SQLITE_OK) {
    RCTLogInfo(@"Error: failed to prepare query statement with message '%s'.", sqlite3_errmsg(database));
    reject(@"db error", @"Error querying database", nil);
    return;
  }
  
  NSMutableArray* languages = [[NSMutableArray alloc] init];
  int row_count = 0;
  while (sqlite3_step(stmt) == SQLITE_ROW) {
    [languages addObject:[[NSString alloc] initWithUTF8String: (char*) sqlite3_column_text(stmt, 0)]];
    row_count++;
  }
  
  stmt = NULL;
  sqlite3_finalize(stmt);
  resolve(languages);
  RCTLogInfo(@"Completed query for languages with row count %d", row_count);
}

RCT_EXPORT_METHOD(getChapters:(NSString*) langCode
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if ([self lazyOpenDB] == false) {
    reject(@"db error", @"Error opening database", nil);
  }
 
  NSString *sql = [NSString stringWithFormat:@"select b.name, b.number, c.number, v.number from verse v, chapter c, book b, bible bb where bb.lang = '%@' and b.bible_id = bb.id and c.book_id = b.id and v.chapter_id = c.id", langCode];
  sqlite3_stmt *stmt = NULL;
  
  RCTLogInfo(@"Running a query %s", [sql UTF8String]);
  
  if (sqlite3_prepare_v2(database, [sql UTF8String], -1, &stmt , NULL) != SQLITE_OK) {
    RCTLogInfo(@"Error: failed to prepare query statement with message '%s'.", sqlite3_errmsg(database));
    reject(@"db error", @"Error querying database", nil);
    return;
  }
  
  NSMutableArray* chapters = [[NSMutableArray alloc] init];
  int row_count = 0;
  while (sqlite3_step(stmt) == SQLITE_ROW) {
    NSMutableArray* chapterInfo = [[NSMutableArray alloc] init];
    [chapterInfo addObject:[[NSString alloc] initWithUTF8String: (char*) sqlite3_column_text(stmt, 0)]];
    [chapterInfo addObject: [NSNumber numberWithInt: (int) sqlite3_column_int(stmt, 1)]];
    [chapterInfo addObject: [NSNumber numberWithInt: (int) sqlite3_column_int(stmt, 2)]];
    [chapterInfo addObject: [NSNumber numberWithInt: (int) sqlite3_column_int(stmt, 3)]];
    [chapters addObject: chapterInfo];
    row_count++;
  }
  
  stmt = NULL;
  sqlite3_finalize(stmt);
  resolve(chapters);
  RCTLogInfo(@"Completed query for chapters with row count %d", row_count);
}

RCT_EXPORT_METHOD(closeDB)
{
  sqlite3_close(database);
}

- (bool)lazyOpenDB {  
  NSString *databasePathFromApp = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:DB_NAME];

  if (database == NULL) {
    if (sqlite3_open([databasePathFromApp UTF8String], &database) != SQLITE_OK) {
      RCTLogInfo(@"Couldn't open %s", [databasePathFromApp UTF8String]);
      return false;
    }
  }
  return true;
}

@end
