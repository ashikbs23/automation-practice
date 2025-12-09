import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import fs from 'fs-extra';

test('User Registration Flow with Faker + Save to CSV', async ({ page }) => {

  // ---- Generate Fake Data ----
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const company = faker.company.name();
  const street = faker.location.streetAddress();
  const zipcode = faker.location.zipCode();
  const city = faker.location.city();
  const password = faker.internet.password({ length: 10 }) + "@1";

  // ---- Save data to CSV ----
  const csvHeader = "FirstName,LastName,Email,Company,Street,ZipCode,City,Password\n";
  const csvRow = `${firstName},${lastName},${email},${company},${street},${zipcode},${city},${password}\n`;

  const csvFile = "test-data.csv";

  // If file does not exist → add header
  if (!fs.existsSync(csvFile)) {
    fs.writeFileSync(csvFile, csvHeader);
  }
  // Append new row
  fs.appendFileSync(csvFile, csvRow);

  console.log("Saved Faker Data to CSV:", csvRow);


  // ---- Start Test ----  
  await page.goto('http://localhost:8065/register?returnUrl=%2F');

  await expect(page.locator("//h1[contains(.,'Register')]")).toBeVisible();

  // Select Gender 
  await page.locator("//input[@id='gender-male']").check();

  // Fill Name  
  await page.locator("//input[@id='FirstName']").fill(firstName);
  await page.locator("//input[@id='LastName']").fill(lastName);

  // Date of Birth
  await page.locator("//select[@name='DateOfBirthDay']").selectOption('10');
  await page.locator("//select[@name='DateOfBirthMonth']").selectOption('5');
  await page.locator("//select[@name='DateOfBirthYear']").selectOption('1999');

  // Email
  await page.locator("//input[@id='Email']").fill(email);

  // Company
  await page.locator("//input[@id='Company']").fill(company);

  // Street Address
  await page.locator("//input[@id='StreetAddress']").fill(street);

  // Zip Code
  await page.locator("//input[@id='ZipPostalCode']").fill(zipcode);

  // City
  await page.locator("//input[@id='City']").fill(city);

  // Country
  await page.locator("//select[@id='CountryId']").selectOption("1");

  // Password & Confirm
  await page.locator("//input[@id='Password']").fill(password);
  await page.locator("//input[@id='ConfirmPassword']").fill(password);

  // Submit
  await page.locator("//button[@id='register-button']").click();

});
