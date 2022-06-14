const express = require("express");
const { google } = require("googleapis");
const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");
const { googleSheetService } = require("./services/googleSheetService");
const { getAuth } = require("./services/InitGoogleSheet");

var jsonParser = bodyParser.json();
const PORT = process.env.PORT || 3000;
const spreadsheetId = process.env.SPREADSHEET_ID;
app.use(cors());

app.get("/", function (req, res) {
  res.send("403 Unauthorized.");
});

var auth;

getAuth()
  .then((auth2client) => (auth = auth2client))
  .catch(() => {
    console.log("need crediential.json to create connection");
    process.exit(1);
  });

const template = [
  [
    "date",
    "email",
    "firstname",
    "lastname",
    "phone",
    "devis__liste_des_meubles",
    "devis__manutention",
    "devis__assurance",
    "devis__volume_de_stockage_estime",
    "devis__transport_en_stockage",
    "devis__prix_transport",
    "devis__prix_du_stockage_estime",
    "source_contact1",
  ],
];

app.post("/createOrUpdate", jsonParser, async (req, res) => {
  try {
    // create service
    const service = google.sheets({ version: "v4", auth });
    // get header of the sheet
    const header = await googleSheetService.getRow(
      service,
      spreadsheetId,
      "A1:U1"
    );
    // if no header add header
    if (!header)
      await googleSheetService.appendValue(
        service,
        spreadsheetId,
        "A1",
        template
      );

    // add a space at index 2
    // await googleSheetService.addRow(service, spreadsheetId, 2, 3);

    // create array with in the correct order
    const value = [[]];
    value[0].push(new Date().toDateString());
    template[0].forEach((headerString) => {
      if (headerString === "date") return;
      const val = req.body.properties.find(
        (item) => item.property === headerString
      );
      if (!val) {
        value[0].push(undefined);
        return;
      }
      if (headerString === "phone")
        return value[0].push(val.value.replace("'", ""));
      if (headerString === "devis__manutention")
        value[0].push(val.value ? "oui" : "non");
      value[0].push(val.value);
    });

    // add data to the sheet
    await googleSheetService.appendValue(service, spreadsheetId, "A3", value);

    res.send({ ok: "ok" });
  } catch (err) {
    console.log(err);
    res.send({ ok: err });
  }
});

app.listen(PORT, function () {
  console.log(`Gilbert app running on ${PORT}`);
});
