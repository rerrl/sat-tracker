import { dialog } from "electron";

class SystemService {
    constructor() {
    }

    public promptForFile = async (title: string, fileType: 'csv') => {
        const filterName = fileType === 'csv' ? 'CSV Files' : 'All Files';

        return new Promise<string[]>((resolve) => {
            dialog.showOpenDialog({
                title,
                properties: ["openFile"],
                filters: [{ name: filterName, extensions: [fileType] }],
            }).then((result) => {
                resolve(result.filePaths);
            });
        });
    }
}

export default new SystemService();