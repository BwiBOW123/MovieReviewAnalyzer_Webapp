import base64

file_path = "C:\\Users\\Thanawat\\Downloads\\TheCovenant.jpg"

with open(file_path, "rb") as image_file:
    image_base64 = base64.b64encode(image_file.read()).decode("utf-8")

# บันทึกข้อมูลลงในไฟล์ text
output_file_path = "C:\\Users\\Thanawat\\Downloads\\image_base64.txt"
with open(output_file_path, "w") as output_file:
    output_file.write(image_base64)

print(f"Base64 encoded image has been saved to {output_file_path}")
