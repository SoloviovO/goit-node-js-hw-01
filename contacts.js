const fsp = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");

const contactsPath = path.join(__dirname, "db/contacts.json");

async function getContacts() {
  const contacts = await fsp.readFile(contactsPath);
  const parsedContacts = JSON.parse(contacts);
  return parsedContacts;
}
async function updateContacts(contacts) {
  await fsp.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function listContacts() {
  console.table(await getContacts());
  return await getContacts();
}

async function getContactById(contactId) {
  const contacts = await getContacts();
  const contact = contacts.find((item) => item.id === contactId);
  if (!contact) {
    throw new Error("The contact is not found");
  }
  console.log(contact);
  return contact;
}

async function removeContact(contactId) {
  const contacts = await getContacts();
  const contactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );
  if (contactIndex === -1) {
    throw new Error("The contact is not found");
  }
  contacts.splice(contactIndex, 1);
  await updateContacts(contacts);
  console.table(contacts);
}

async function addContact(name, email, phone) {
  const newContact = { id: nanoid(), name, email, phone };
  const contacts = await getContacts();
  contacts.push(newContact);
  await updateContacts(contacts);
  console.table(contacts);
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
