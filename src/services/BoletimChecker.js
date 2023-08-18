import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import * as Notifications from 'expo-notifications';
const BACKGROUND_FETCH_TASK = 'background-fetch';

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    // const now = Date.now();

    // console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

    // Notifications.scheduleNotificationAsync({
    //     content: {
    //         title: "You've got mail! 📬",
    //         body: 'Here is the notification body',
    //         data: { data: 'goes here' },
    //     },
    //     trigger: { seconds: 2 }
    // });

    // // Be sure to return the successful result type!
    // return BackgroundFetch.BackgroundFetchResult.NewData;
});

// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 2, // 15 minutes
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
    });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export default {
    register: registerBackgroundFetchAsync,
    unregister: unregisterBackgroundFetchAsync,
}