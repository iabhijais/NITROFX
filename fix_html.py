content = open(r'c:\Users\ASUS\Downloads\Gautam\index.html', 'r', encoding='utf-8').read()

# Find where clicks section properly ends (after clicksGrid div)
clicks_section_end = content.find('</section>', content.find('id="clicksGrid"'))
clicks_section_end = clicks_section_end + len('</section>')

# Find where CONTACT section starts
contact_start = content.find('<!-- CONTACT -->')

if clicks_section_end > 0 and contact_start > 0:
    new_content = content[:clicks_section_end] + '\n\n\n  ' + content[contact_start:]
    open(r'c:\Users\ASUS\Downloads\Gautam\index.html', 'w', encoding='utf-8').write(new_content)
    removed = len(content) - len(new_content)
    print(f'Done! Removed {removed} chars of dangling HTML')
    print(f'clicks_section_end at char: {clicks_section_end}')
    print(f'contact_start at char: {contact_start}')
else:
    print(f'ERROR: clicks_end={clicks_section_end}, contact_start={contact_start}')
