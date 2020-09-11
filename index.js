const wdio = require("webdriverio");
const assert = require("assert");

const WAIT_FOR_EXIST_CONFIG = { timeout: 5000 };
const opts = {
  path: "/wd/hub",
  port: 4723,
  capabilities: {
    platformName: "Android",
    deviceName: "emulator-5554",
    app:
      "D:/reactNativeProjects/starterkit/Starter-Mobile-Kit/startermobileapp/android/app/build/outputs/apk/debug/app-debug.apk",
    automationName: "UiAutomator2",
  },
};

// Close the popup that is shown each time you load the app
async function closeReactNativeLogPoppup(client) {
  //android Xpath
  const popupXpath =
    "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup[2]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[3]";
  const closePopupButton = await client.$(popupXpath);
  await closePopupButton.waitForExist({ timeout: 10000 });
  await closePopupButton.click();
}

// // Use this function to wait for certain components to be rendered since appium isn't that fast
//  Or you can just use the WaitForExist() function
// async function wait(time) {
//   await new Promise((r) => setTimeout(r, time));
// }

// Use this function to use the back button present in the appBar
async function navigateBack(client) {
  //android Xpath
  const backButton = await client.$(
    '//android.widget.Button[@content-desc="All Dummies, back"]/android.widget.ImageView'
  );
  await backButton.waitForExist(WAIT_FOR_EXIST_CONFIG);
  await backButton.click();
}

// Use this function to add a dummy through the add button
async function AddDummy(client, title, description) {
  const btn = await client.$("~addButton");
  await btn.waitForExist(WAIT_FOR_EXIST_CONFIG);

  await btn.click();
  await fillForm(client, title, description);
}

// This will select the first dummy from the list and edit it
async function EditDummy(client, item, title, description) {
  await item.waitForExist(WAIT_FOR_EXIST_CONFIG);
  await item.click();

  const updateButton = await client.$("~updateButton");
  await updateButton.waitForExist(WAIT_FOR_EXIST_CONFIG);
  await updateButton.click();

  await fillForm(client, title, description);
  await navigateBack(client);
}

// When editing or adding a dummy this will fill the form with title and description
async function fillForm(client, title, description) {
  const titleInput = await client.$("~titleInput");
  const descriptionInput = await client.$("~descriptionInput");

  await descriptionInput.waitForExist(WAIT_FOR_EXIST_CONFIG);

  await titleInput.clearValue();
  await titleInput.setValue(title);
  await titleInput.click(); // this is needed to trigger onInputChange

  await descriptionInput.clearValue();
  await descriptionInput.setValue(description);
  await descriptionInput.click(); // this is needed to trigger onInputChange

  const submitButton = await client.$("~submitDummyButton");
  await submitButton.click(); // this will click away from the input
  await submitButton.click(); // this will click on the button
}

// This function just fills the searchBar with string given as parameter
async function testSearchBar(client, searchString) {
  const searchBar = await client.$("~searchBar");
  await searchBar.waitForExist(WAIT_FOR_EXIST_CONFIG);

  await searchBar.click();
  await searchBar.setValue(searchString);
}

// This function will delete the item given
async function deleteDummy(client, item) {
  //Android Xpath
  const alertAcceptButtonXpath =
    "/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[2]";

  await item.waitForExist(WAIT_FOR_EXIST_CONFIG);
  await item.click();

  const deleteButton = await client.$("~deleteButton");
  await deleteButton.click();

  // Once delete button clicked an alert is shown, this will click on the accept button.
  const alertAccept = await client.$(alertAcceptButtonXpath);
  await alertAccept.click();
}

async function main() {
  const client = await wdio.remote(opts);

  // To be able tock click on the addDummy button first we need to dismiss the popup
  await closeReactNativeLogPoppup(client);
  await AddDummy(
    client,
    "Added item while testing",
    "Lorem ipsum sit dolor amn, vit arun monoluc heig valarus dohaeris"
  );

  // Each item in the list have a ViewDetails button, this query will look for every
  // Viewdetails button and returns their reference inside an array
  const viewDetailsButtons = await client.$$("~viewDetailsButton");
  await EditDummy(
    client,
    viewDetailsButtons[0],
    "Edited item while testing",
    "Lorem ipsum sit dolor amn, vit arun monoluc heig valarus dohaeris EDITED EDITED EDITED"
  );
  await deleteDummy(client, viewDetailsButtons[0]);
}

main();
