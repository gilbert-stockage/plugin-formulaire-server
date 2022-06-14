class GoogleSheetService {
  async getRow(service, spreadsheetId, range) {
    try {
      const result = await service.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      return result.data.values;
    } catch (err) {
      // TODO (Developer) - Handle exception
      throw err;
    }
  }

  async addRow(service, spreadsheetId, startIndex, endIndex) {
    const insertDimension = {
      range: {
        sheetId: 0,
        dimension: "ROWS",
        startIndex: startIndex,
        endIndex: endIndex,
      },
      inheritFromBefore: false,
    };
    try {
      const result = await service.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests: [{ insertDimension }] },
      });
      return result.data;
    } catch (err) {
      // TODO (Developer) - Handle exception
      throw err;
    }
  }

  async appendValue(
    service,
    spreadsheetId,
    range,
    values = [[]],
    valueInputOption = "RAW"
  ) {
    const resource = {
      values,
    };
    try {
      const result = await service.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption,
        resource,
      });
      return result.data;
    } catch (err) {
      // TODO (Developer) - Handle exception
      throw err;
    }
  }
}

module.exports = {
  googleSheetService: new GoogleSheetService(),
};
