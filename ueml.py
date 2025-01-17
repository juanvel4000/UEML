import shlex

class UEML:
    
    def __init__(self, file):
        self.file = file

    def read(self):
        sections = {}
        current_section_name = None

        try:
            with open(self.file, 'r') as file:
                for line_num, line in enumerate(file, 1):
                    line = line.strip()

                    # Skip comments
                    if line.startswith('//'):
                        continue

                    # Start a new section
                    elif line.startswith('>'):
                        current_section_name = line[1:].strip()
                        sections[current_section_name] = {}

                    # Process key-value pairs within sections
                    else:
                        if not line.endswith(';'):
                            raise SyntaxError(f'Missing semicolon at the end of line {line_num}: {line}')
                        if current_section_name is None:
                            raise SyntaxError(f'Variable defined outside of a section at line {line_num}.')

                        key, value = line[:-1].split('=', 1)
                        key = key.strip()
                        value = self._parse_value(value.strip())

                        sections[current_section_name][key] = value

        except FileNotFoundError:
            raise FileNotFoundError(f'The file {self.file} does not exist.')
        except SyntaxError as e:
            raise SyntaxError(e)

        return sections

    def _parse_value(self, value):
        """Parses the value into the appropriate Python type."""
        value = shlex.split(value)[0]

        if value.lower() == "true":
            return True
        elif value.lower() == "false":
            return False
        elif value.isdigit():
            return int(value)
        elif value.replace('.', '', 1).isdigit():
            return float(value)
        elif ',' in value:
            return [self._convert_to_number(v.strip()) for v in value.split(',')]
        else:
            return value

    def _convert_to_number(self, s):
        """Helper function to convert a string to int or float if possible."""
        if s.isdigit():
            return int(s)
        try:
            return float(s)
        except ValueError:
            return s
