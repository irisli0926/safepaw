// ⚙️ Run once to enable Firebase setup
const FIREBASE_URL = 'https://safepaw-82db9.firebaseio.com';
const FIREBASE_PROJECT_ID = 'safepaw-82db9';
const FIREBASE_COLLECTION = 'pets';
const FIREBASE_API_KEY = 'AIzaSyDKGHFIn5uiCgsT2d3r49pDM7HdXUI_wrc';

function onFormSubmit(e) {
  const responses = e.namedValues;

  const tagId = getTagIdFromSheetRow(e.range.getRow());

  const petData = {
    name: responses["Name"]?.[0] || '',
    breed: responses["Breed"]?.[0] || '',
    gender: responses["Gender"]?.[0] || '',
    chipped: responses["Chipped"]?.[0] || '',
    age: responses["Age"]?.[0] || '',
    blood: responses["Blood Type"]?.[0] || '',
    weight: responses["Weight"]?.[0] || '',
    color: responses["Color"]?.[0] || '',
    about: responses["About"]?.[0] || '',
    allergies: responses["Allergies"]?.[0] || '',
    redMeds: responses["Critical Medications"]?.[0] || '',
    medications: parseListPairs(responses["Current Medications"]?.[0] || ''),
    surgeries: parseListPairs(responses["Past Surgeries"]?.[0] || ''),
    conditions: responses["Chronic Conditions"]?.[0] || '',
    shots: responses["Shots"]?.[0] || '',
    lastUpdated: new Date().toISOString().split('T')[0]
  };

  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${FIREBASE_COLLECTION}/${tagId}?key=${FIREBASE_API_KEY}`;
  
  const payload = {
    fields: buildFirestoreFields(petData)
  };

  UrlFetchApp.fetch(url, {
    method: 'PATCH',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  });
}

function parseListPairs(input) {
  const lines = input.split('\n').filter(l => l.trim());
  return lines.map(line => {
    const [name, amount] = line.split(':');
    return {
      name: name?.trim() || '',
      amount: amount?.trim() || ''
    };
  });
}

function buildFirestoreFields(obj) {
  const fields = {};
  for (let key in obj) {
    const value = obj[key];
    if (Array.isArray(value)) {
      fields[key] = {
        arrayValue: {
          values: value.map(v =>
            ({ mapValue: { fields: buildFirestoreFields(v) } })
          )
        }
      };
    } else {
      fields[key] = { stringValue: String(value) };
    }
  }
  return fields;
}

function getTagIdFromSheetRow(row) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const tagColIndex = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].indexOf("Tag ID") + 1;
  return sheet.getRange(row, tagColIndex).getValue();
}
