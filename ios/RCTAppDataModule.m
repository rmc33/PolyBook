//
//  RCTAppDataModule.m
//  AwesomeProject
//
//  Created by Ryan Conigliaro on 6/11/22.
//

// RCTAppDataModule.m
#import "RCTAppDataModule.h"

@implementation RCTAppDataModule

// To export a module named RCTAppDataModule
RCT_EXPORT_MODULE();

  NSString *appFileChaptersCompleted = NULL;

+ (void)initialize {
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,  NSUserDomainMask, YES);
  NSString *documentsDirectory = [paths objectAtIndex:0];
  appFileChaptersCompleted = [documentsDirectory stringByAppendingPathComponent:@"appDataChaptersCompleted.json"];

  NSFileHandle *file = [NSFileHandle fileHandleForReadingAtPath:appFileChaptersCompleted];
  //assign file path directory
  if (file == nil) //check file exist or not
    [[NSFileManager defaultManager] createFileAtPath:appFileChaptersCompleted contents:nil attributes:nil];
}

RCT_EXPORT_METHOD(updateChaptersCompleted:(NSString*) chaptersCompletedJSON
    resolver:(RCTPromiseResolveBlock)resolve
    rejecter:(RCTPromiseRejectBlock)reject)
{
  [chaptersCompletedJSON writeToFile:appFileChaptersCompleted atomically:YES encoding:NSUTF8StringEncoding error:nil];
  resolve(nil);
}

RCT_EXPORT_METHOD(readChaptersCompleted:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  NSString *content = [NSString stringWithContentsOfFile:appFileChaptersCompleted encoding:NSUTF8StringEncoding error:nil];
  resolve(content);
}


@end
