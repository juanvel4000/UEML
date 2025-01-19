
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

UEML is published for Various Programming languages, The official Implementation is for _Python_, The recommended way to install UEML in Python is with `pip`
### Python
#### pip
Install with `pip`
```bash
pip install UEML
```
#### Arch Linux
Use the PKGBUILD to install `python-ueml`
### Node.js
Install with `npm`
```bash
npm install ueml
```
### Ruby
Install with `gem`
```bash
gem install UEML
```
## Note
UEML is not production ready (yet), therefore several functions or features could be incomplete in some **implementations**, feel free to pull request and send **issues**
## License

**UEML** is licensed with the **MIT** License, read **LICENSE**

