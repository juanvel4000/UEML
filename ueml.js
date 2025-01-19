const fs = require('fs');

class UEML {
  constructor(file) {
    this.file = file;
  }

  read() {
    const sections = {};
    let currentSectionName = null;
    let multilineValue = false;
    let currentValue = '';
    let currentKey = '';

    try {
      const fileContent = fs.readFileSync(this.file, 'utf8');
      const lines = fileContent.split('\n');

      lines.forEach((line, lineNum) => {
        line = line.trim();

        if (line.startsWith('//')) return;

        if (line.startsWith('>')) {
          currentSectionName = line.slice(1).trim();
          if (!sections[currentSectionName]) {
            sections[currentSectionName] = {};
          }
        } else {
          if (!line.endsWith(';')) {
            throw new SyntaxError(`Missing semicolon at line ${lineNum + 1}: ${line}`);
          }

          if (currentSectionName === null) {
            throw new SyntaxError(`Variable defined outside of a section at line ${lineNum + 1}.`);
          }

          const [key, value] = line.slice(0, -1).split('=', 2).map(s => s.trim());
          if (!key || value === undefined) {
            throw new SyntaxError(`Invalid syntax at line ${lineNum + 1}: ${line}`);
          }

          if (value.endsWith('\\')) {
            currentKey = key;
            currentValue += value.slice(0, -1).trim();
            multilineValue = true;
          } else {
            if (multilineValue) {
              currentValue += ` ${value.trim()}`;
              sections[currentSectionName][currentKey] = this._parseValue(currentValue);
              multilineValue = false;
            } else {
              sections[currentSectionName][key] = this._parseValue(value);
            }
          }
        }
      });
    } catch (err) {
      throw new Error(`Error reading UEML file: ${err.message}`);
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

  write(outputFile) {
    try {
      const sections = this.read();
      let output = '';

      for (const section in sections) {
        output += `>${section}\n`;

        for (const key in sections[section]) {
          const value = sections[section][key];
          output += `${key} = ${this._formatValue(value)};\n`;
        }
      }

      fs.writeFileSync(outputFile, output, 'utf8');
    } catch (err) {
      throw new Error(`Error writing UEML file: ${err.message}`);
    }
  }

  _formatValue(value) {
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    return value.toString();
  }

  display() {
    const sections = this.read();
    for (const section in sections) {
      console.log(`[${section}]`);
      for (const key in sections[section]) {
        console.log(`  ${key} = ${sections[section][key]}`);
      }
      console.log();
    }
  }
}

module.exports = UEML;
