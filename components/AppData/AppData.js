
import { NativeModules } from 'react-native';
const { AppDataModule } = NativeModules;

export default AppData = () => {

    const allChaptersCompleted = {};

    const updateChapterCompleted = (chapterCompleted) => {
        const { bookId, chapterId, lastPageCompletedId } = chapterCompleted;
        const book = allChaptersCompleted[bookId] || {};
        book[chapterId] = {
            lastPageCompletedId
        };
        allChaptersCompleted[bookId] = book;
        AppDataModule.updateChaptersCompleted(JSON.stringify(allChaptersCompleted));
    };

    return  {
        updateChapterCompleted
    };
}