
import { NativeModules } from 'react-native';
const { AppDataModule } = NativeModules;

export default AppData = () => {

    const allChaptersCompleted = {};

    const updateChaptersCompleted = (chapterCompleted) => {
        var book = allChaptersCompleted[chapterCompleted.bookId] || {};
        book[chapterCompleted.chapterId] = {
            lastPageCompletedId: chapterCompleted.lastPageCompletedId,
            totalPagesInChapter: chapterCompleted.totalPagesInChapter,
            percentageCompleted: chapterCompleted.lastPageCompletedId / chapterCompleted.totalPagesInChapter * 100
        };
        allChaptersCompleted[chapterCompleted.bookId] = book;
        AppDataModule.updateChaptersCompleted(JSON.stringify(allChaptersCompleted));
    };

    const buildChapterCompleted = () => {
        var chapterCompletedBuilder = {
            chapter: function(c) {
                chapterCompletedBuilder.currentChapterId = c;
                return chapterCompletedBuilder;
            },
            book: function(b) {
                chapterCompletedBuilder.currentBookId = b;
                return chapterCompletedBuilder;
            },
            lastPageCompleted: function(p) {
                chapterCompletedBuilder.lastPageCompletedId = p;
                return chapterCompletedBuilder;
            },
            totalPages: function(total) {
                chapterCompletedBuilder.totalPagesInChapter = total;
                return chapterCompletedBuilder;
            },
            build: function() {
                return  {
                    bookId: chapterCompletedBuilder.currentBookId,
                    chapterId: chapterCompletedBuilder.currentChapterId,
                    lastPageCompletedId: chapterCompletedBuilder.lastPageCompletedId,
                    totalPagesInChapter: chapterCompletedBuilder.totalPagesInChapter
                };
            }
        };
        return chapterCompletedBuilder;
    };

    return  {
        updateChaptersCompleted,
        buildChapterCompleted
    };
}