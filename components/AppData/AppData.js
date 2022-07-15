
import { NativeModules } from 'react-native';
const { AppDataModule } = NativeModules;
const allChaptersCompleted = {};

export const updateChapterCompleted = (chapterCompleted) => {
    const { bookId, chapterNumber, lastPageNumber } = chapterCompleted;
    const book = allChaptersCompleted[bookId] || {};
    const chapter = book[chapterNumber] || {};
    const pagesCompleted = chapter.pagesCompleted || [];
    pagesCompleted.push(lastPageNumber);
    book[chapterId] = {
        lastPageNumber,
        pagesCompleted
    };
    allChaptersCompleted[bookId] = book;
    AppDataModule.updateChaptersCompleted(JSON.stringify(allChaptersCompleted));
};

export const readChaptersCompleted = () => {
    return AppDataModule.readChaptersCompleted().then((chaptersCompleted) => {
        return JSON.parse(chaptersCompleted);
    });
}