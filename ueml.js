const fs = require('fs');

class UEML {
  constructor(file) {
    this.file = file;
  }

  read() {
    const sections = {};
    let currentSectionName = null;

    try {
      const fileContent = fs.readFileSync(this.file, 'utf8');
      const lines = fileContent.split('\n');

      lines.forEach((line, lineNum) => {
        line = line.trim();

        // Ignore comments
        if (line.startsWith('//')) return;

        // Handle section
        if (line.startsWith('>')) {
          currentSectionName = line.slice(1).trim();
          sections[currentSectionName] = {};
        } else {
          if (!line.endsWith(';')) {
            throw new SyntaxError(`Missing semicolon at line ${lineNum + 1}: ${line}`);
          }

          if (currentSectionName === null) {
            throw new SyntaxError(`Variable defined outside a section at line ${lineNum + 1}.`);
          }

          const [key, value] = line.slice(0, -1).split('=', 2).map(s => s.trim());
          sections[currentSectionName][key] = this._parseValue(value);
        }
      });
    } catch (err) {
      throw new Error(err.message);
    }

    return sections;
  }

  _parseValue(value) {
    value = value.trim();

    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;

    if (!isNaN(value)) {
      return value.includes('.') ? parseFloat(value) : parseInt(value);
    }

    if (value.includes(',')) {
      return value.split(',').map(v => this._convertToNumber(v.trim()));
    }

    return value;
  }

  _convertToNumber(s) {
    if (!isNaN(s)) {
      return s.includes('.') ? parseFloat(s) : parseInt(s);
    }
    return s;
  }
}
