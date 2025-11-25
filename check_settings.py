import ast

code = open('settings.py').read()
tree = ast.parse(code)

for node in ast.walk(tree):
    if isinstance(node, ast.Assign):
        for target in node.targets:
            if isinstance(target, ast.Name) and target.id == 'INSTALLED_APPS':
                # Extrair strings da lista
                if isinstance(node.value, ast.List):
                    strings = []
                    for elt in node.value.elts:
                        if isinstance(elt, ast.Constant) and isinstance(elt.value, str):
                            if 'vend' in elt.value:
                                print(f"ENCONTRADO: {elt.value}")
                                strings.append(elt.value)
                    if not strings:
                        print("vendas NÃO encontrado na AST")
                        # Print todos os strings com 'apps'
                        for elt in node.value.elts:
                            if isinstance(elt, ast.Constant) and isinstance(elt.value, str) and 'apps' in elt.value:
                                print(f"  {elt.value}")
