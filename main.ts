import { app, BrowserWindow } from 'electron';
import { startAuthenticationSession } from "./src/get-credentials";


app.on('ready', async () => {
    try {
        const window = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                devTools: false, // Set to true to enable web console debugging.
            }
        });
        await startAuthenticationSession(window);
    } catch (err) {
        console.log(err)
    }
})

app.on('window-all-closed', () => {
    console.log(
        'closing app..'
    )
    app.quit()
})
