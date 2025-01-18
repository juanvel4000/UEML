
# UEML
UEML is a simple Markup Language inspired in **TOML** and **ini**

## Syntax
**UEML** has a similar syntax to **TOML** and **ini/conf**
```
> Section
variable = value;
array = 1,2,3,4,5;
// This is a comment
```
**UEML** Comments cannot go appended on a **line**

Unlike **TOML**/**ini**, **UEML** Declares Sections with `>` instead of wrapping the name in `[]`

**UEML** Variables finish with a semicolon, `;`

## Installation

The official UEML _Python_ Module is in [PyPI](https://pypi.org/project/UEML)

```bash
  pip install UEML
```
    
There is also a **UEML** Module for _Ruby_, install it with 
```bash
gem install UEML
```
## License

**UEML** is licensed with the **MIT** License, read **LICENSE**

