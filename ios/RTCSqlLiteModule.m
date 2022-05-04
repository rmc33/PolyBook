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

RCT_EXPORT_METHOD(getVerse:(NSInteger)chapterId verseNumber:(NSInteger)verseNumber
    resolver:(RCTPromiseResolveBlock)resolve
    rejecter:(RCTPromiseRejectBlock)reject)
{
 
  if (!lazyOpen()) {
    reject(@"db error", @"Error opening database", nil);
  }
  
  NSString *sql = [NSString stringWithFormat:@"select text from verse where chapter_id=%ld and number=%ld;", chapterId, verseNumber];
  
  sqlite3_stmt *stmt = NULL;
  
  RCTLogInfo(@"Running a query %s", [sql UTF8String]);
  
  if (sqlite3_prepare_v2(database, [sql UTF8String], -1, &stmt , NULL) != SQLITE_OK) {
    RCTLogInfo(@"Error: failed to prepare query statement with message '%s'.", sqlite3_errmsg(database));
    reject(@"db error", @"Error querying database", nil);
    return;
  }
  
  NSMutableString *verseText = nil;
  int row_count = 0;
  while (sqlite3_step(stmt) == SQLITE_ROW) {
    verseText = [[NSMutableString alloc] initWithUTF8String: (char*) sqlite3_column_text(stmt, 0)];
    row_count++;
  }
  
  stmt = NULL;
  sqlite3_finalize(stmt);
  resolve(verseText);
  RCTLogInfo(@"Completed query with arguments %ld at %ld with %d results", chapterId, verseNumber, row_count);
}

RCT_EXPORT_METHOD(closeDB)
{
  sqlite3_close(database);
}

RCT_EXPORT_METHOD(getLanguages: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if (!lazyOpen()) {
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
    [languages addObject:[[NSMutableString alloc] initWithUTF8String: (char*) sqlite3_column_text(stmt, 0)]];
    row_count++;
  }
  
  stmt = NULL;
  sqlite3_finalize(stmt);
  resolve(languages);
  RCTLogInfo(@"Completed query for languages");
}

bool lazyOpen() {
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
