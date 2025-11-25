with open('settings.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Encontrar a linha com 'apps.vendas' e garantir que está dentro do INSTALLED_APPS
in_installed_apps = False
has_vendas = False

new_lines = []
for i, line in enumerate(lines):
    if 'INSTALLED_APPS = [' in line:
        in_installed_apps = True
    elif in_installed_apps and line.strip() == ']':
        in_installed_apps = False
    
    if 'apps.vendas' in line:
        has_vendas = True
        # Se estiver comentada, descomente
        if '#' in line:
            line = line.replace("#'apps.vendas'", "'apps.vendas'")
    
    new_lines.append(line)

with open('settings.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Vendas encontrado: {has_vendas}")
print("Arquivo atualizado")
