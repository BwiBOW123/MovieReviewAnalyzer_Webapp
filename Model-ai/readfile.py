import os
import glob

folder_path = 'C:\\Users\\Thanawat\\Desktop\\Work\\Model\\Dataset\\pos'
text_files = glob.glob(os.path.join(folder_path, '*.txt'))
positive_sentences = []
for file_path in text_files:
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
        positive_sentences.append(content)


positive_labels = [1] * len(positive_sentences)
print(positive_labels)
