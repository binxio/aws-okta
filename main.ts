import { app, BrowserWindow, ipcMain } from 'electron';
import { startAuthenticationSession } from "./src/get-credentials";


app.on('ready', async () => {
    ipcMain.on('selectedRole', (event, selectedRole) => {
        console.log("From listener: " +  selectedRole)
    })
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
        await startAuthenticationSession(window);
    } catch (err) {
        console.log(err)
    }
})

app.on('window-all-closed', () => {
    app.quit()
})

export default app;