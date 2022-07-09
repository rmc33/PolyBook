
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
        const builder = {
            chapter: function(c) {
                builder.currentChapterId = c;
                return builder;
            },
            book: function(b) {
                builder.currentBookId = b;
                return builder;
            },
            lastPageCompleted: function(p) {
                builder.lastPageCompletedId = p;
                return builder;
            },
            totalPages: function(total) {
                builder.totalPagesInChapter = total;
                return builder;
            },
            build: function() {
                return  {
                    bookId: builder.currentBookId,
                    chapterId: builder.currentChapterId,
                    lastPageCompletedId: builder.lastPageCompletedId,
                    totalPagesInChapter: builder.totalPagesInChapter
                };
            }
        };
        return builder;
    };

    return  {
        updateChaptersCompleted,
        buildChapterCompleted
    };
}