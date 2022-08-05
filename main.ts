import { app, BrowserWindow, ipcMain } from 'electron';
import { startAuthenticationSession, processSelectedRole } from "./src/get-credentials";


app.on('ready', async () => {
    try {
        const window = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                devTools: true, // Set to true to enable web console debugging.
                nodeIntegration: true,
                contextIsolation: false,
            }
        });

        ipcMain.on('selectedRole', async (event, selectedRole) => {
            await processSelectedRole(selectedRole);
            window.close();
        });

        await startAuthenticationSession(window);
    } catch (err) {
        console.log(err)
    }
});

app.on('window-all-closed', () => {
    app.quit()
})

export default app;