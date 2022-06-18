
import { NativeModules } from 'react-native';
const { AppDataModule } = NativeModules;

export default AppData = () => {

    const allChaptersCompleted = {};

    const updateChaptersCompleted = (chapterCompleted) => {
        const { bookId, chapterId, lastPageCompletedId, totalPagesInChapter } = chapterCompleted;
        const book = allChaptersCompleted[bookId] || {};
        book[chapterId] = {
            lastPageCompletedId,
            totalPagesInChapter,
            percentageCompleted: lastPageCompletedId / totalPagesInChapter * 100
        };
        allChaptersCompleted[bookId] = book;
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