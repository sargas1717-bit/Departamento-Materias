import struct
import os

def png_to_ico(png_path, ico_path):
    with open(png_path, 'rb') as f:
        png_data = f.read()
    
    # ICONDIR Header
    # Reserved (2 bytes), Type (2 bytes: 1 for ICO), Count (2 bytes: 1)
    header = struct.pack('<HHH', 0, 1, 1)
    
    # ICONDIRENTRY
    # Width (1), Height (1), ColorCount (1: 0 for >256 colors), Reserved (1)
    # Planes (2: 1), BPP (2: 32), Size (4), Offset (4)
    width = 0 # 256 is 0
    height = 0 # 256 is 0
    size = len(png_data)
    offset = len(header) + 16 # Header + 1 entry
    
    entry = struct.pack('<BBBBHHII', width, height, 0, 0, 1, 32, size, offset)
    
    with open(ico_path, 'wb') as f:
        f.write(header)
        f.write(entry)
        f.write(png_data)

if __name__ == "__main__":
    # La imagen esta en la raiz de electronica_i_web segun ls
    src = r"C:\Users\Sargas-PC\Desktop\Proyectos\Sistema_SEN\electronica_i_web\image.png"
    dst = r"C:\Users\Sargas-PC\Desktop\Proyectos\Sistema_SEN\electronica_i_web\favicon.ico"
    png_to_ico(src, dst)
    print(f"Icono creado exitosamente desde {src} en {dst}")
