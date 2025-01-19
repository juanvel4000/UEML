import shlex

class UEML:
    """
    A class to parse and manipulate UEML (User Extensible Markup Language) files.
    """
    
    def __init__(self, file):
        """
        Initialize with the file to parse.
        
        :param file: Path to the UEML file
        """
        self.file = file

    def read(self):

        sections = {}
        current_section_name = None

        try:
            with open(self.file, 'r') as file:
                for line_num, line in enumerate(file, 1):
                    line = line.strip()

                    if line.startswith('//'):
                        continue

                    elif line.startswith('>'):
                        current_section_name = line[1:].strip()
                        sections[current_section_name] = {}

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
            return self._parse_array(value)
        else:
            return value

    def _parse_array(self, value):

        return [self._convert_to_number(v.strip()) for v in value.split(',')]

    def _convert_to_number(self, s):

        if s.isdigit():
            return int(s)
        try:
            return float(s)
        except ValueError:
            return s

    def write(self, file):

        with open(file, 'w') as f:
            for section, data in self.sections.items():
                f.write(f">{section}\n")
                for key, value in data.items():
                    f.write(f"{key} = {self._format_value(value)};\n")
    
    def _format_value(self, value):

        if isinstance(value, bool):
            return "true" if value else "false"
        elif isinstance(value, list):
            return ', '.join(map(str, value))
        else:
            return str(value)

    def display(self):

        for section, data in self.sections.items():
            print(f"[{section}]")
            for key, value in data.items():
                print(f"  {key} = {value}")
            print()

    def sections(self):

        return self.read()  