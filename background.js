console.log("Background script loaded");

// Track shown notifications to avoid duplicates
const shownNotifications = new Set();

if (chrome.alarms) {
  console.log("chrome.alarms API is available.");

  // Create the alarm to check tasks every minute
  chrome.alarms.create("taskReminder", { periodInMinutes: 1 });
  console.log("Alarm created for task reminders...");

  // Listen for the alarm trigger to check tasks
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "taskReminder") {
      console.log("Alarm triggered: taskReminder");
      checkTasks(); // Trigger task check when the alarm goes off
    }
  });
} else {
  console.error("chrome.alarms API is undefined.");
}

// Function to check tasks stored in chrome storage
function checkTasks() {
  console.log("Checking tasks...");

  const now = new Date();
  const currentTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  console.log("Current Time:", currentTime);

  chrome.storage.local.get("tasks", (data) => {
    const tasks = data.tasks || [];
    console.log("Retrieved tasks:", tasks);

    tasks.forEach((task) => {
      console.log(
        `Checking task: "${task.name}" scheduled at ${task.time} against current time: ${currentTime}`
      );
      if (task.time === currentTime && !shownNotifications.has(task.time)) {
        console.log(`Task Matched: "${task.name}"`);
        notifyTask(task);
      }
    });
  });
}

// Function to display notification for the task
function notifyTask(task) {
  console.log(`Sending notification for task: ${task.name} at ${task.time}`);
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: "Task Reminder",
    message: `It's time for: ${task.name}`,
    requireInteraction: true, // Keeps the notification until dismissed
  });

  // Mark this task as shown
  shownNotifications.add(task.time);

  // Clear it from shown notifications after 1 minute
  setTimeout(() => {
    shownNotifications.delete(task.time);
    console.log(`Cleared task "${task.name}" from shownNotifications.`);
  }, 60000);
}
