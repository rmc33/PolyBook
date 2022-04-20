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
 
  NSString *sql = [NSString stringWithFormat:@"select text from verse where chapter_id=%ld and number=%ld;", chapterId, verseNumber];
  
  sqlite3_stmt *stmt = NULL;
  int row_count = 0;
  
  NSString *databasePathFromApp = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:DB_NAME];
  
  if (database == NULL) {
    if (sqlite3_open([databasePathFromApp UTF8String], &database) != SQLITE_OK) {
      RCTLogInfo(@"Couldn't open %s", [databasePathFromApp UTF8String]);
      reject(@"db error", @"Error opening database", nil);
      return;
    }
  }
  
  RCTLogInfo(@"Running a query %s at %s", [sql UTF8String], [databasePathFromApp UTF8String]);
  
  if (sqlite3_prepare_v2(database, [sql UTF8String], -1, &stmt , NULL) != SQLITE_OK) {
    RCTLogInfo(@"Error: failed to prepare query statement with message '%s'.", sqlite3_errmsg(database));
    reject(@"db error", @"Error querying database", nil);
    return;
  }
  
  NSMutableString *verseText = nil;
  while (sqlite3_step(stmt) == SQLITE_ROW) {
    verseText = [[NSMutableString alloc] initWithUTF8String: (char*) sqlite3_column_text(stmt, 0)];
    row_count++;
  }
  stmt = NULL;
  sqlite3_finalize(stmt);
  resolve(verseText);
  RCTLogInfo(@"Completed query with arguments %ld at %ld ", chapterId, verseNumber);
}

RCT_EXPORT_METHOD(closeDB)
{
  sqlite3_close(database);
}

@end
