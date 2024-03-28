"""
ใช้ Embedding ใน tensorflow generate by chatgpt ฮะ
การ Embedding ใน deep learning คือกระบวนการแปลงคำหรือ token ให้กลายเป็นเวกเตอร์ที่มีมิติน้อยลง เพื่อให้โมเดลสามารถเรียนรู้ลักษณะแบบมีความหมายของคำและความเชื่อมโยงระหว่างคำได้.
สิ่งที่สำคัญในการ Embedding:
มิติ (Dimension): จำนวนของมิติในเวกเตอร์ที่แทนคำ. Embedding dimension เป็น hyperparameter ที่กำหนดขนาดของเวกเตอร์.
Trainable Parameters: พารามิเตอร์ใน embedding layer จะถูกปรับให้เหมาะสมกับข้อมูลในกระบวนการการเรียนรู้ของโมเดล.
การใช้ Embedding ช่วยโมเดลเรียนรู้ลักษณะข้อมูลของภาษาและความสัมพันธ์ระหว่างคำได้ดีขึ้น. ผลลัพธ์จาก embedding ทำให้คำที่ใกล้กันในมิติมีความหมายที่ใกล้เคียง, ช่วยในการเข้าใจลักษณะของข้อมูลข้อความ. การปรับค่า hyperparameter เช่น vocab_size, embedding_dim, หรือการใช้ pre-trained embeddings เป็นวิธีที่สามารถปรับปรุงคุณภาพของ embedding และโมเดลในสิ่งที่เกี่ยวข้องกับข้อความ.
"""

import os
import numpy as np
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Bidirectional, LSTM, Dense

print("Runnig")

# รวม path ทั้งหมดของไฟล์ positive
positive_folder = './Dataset/pos'
positive_files = os.listdir(positive_folder)
positive_data = ""

for file in positive_files:
    with open(os.path.join(positive_folder, file), 'r', encoding='utf-8') as f:
        positive_data += f.read() + '\n'

# รวม path ทั้งหมดของไฟล์ negative
negative_folder = './Dataset/neg'
negative_files = os.listdir(negative_folder)
negative_data = ""

for file in negative_files:
    with open(os.path.join(negative_folder, file), 'r', encoding='utf-8') as f:
        negative_data += f.read() + '\n'

# ต่อมารวม positive และ negative sentences เหมือนเดิม
positive_sentences = positive_data.split('\n')
negative_sentences = negative_data.split('\n')

# กำหนด label 0 คือ negative, 1 คือ positive
positive_labels = [1] * len(positive_sentences)
negative_labels = [0] * len(negative_sentences)

# เชื่อมข้อมูล positive และ negative
sentences = positive_sentences + negative_sentences
labels = positive_labels + negative_labels

# จำนวนคำที่สูงสุดที่จะให้ Network เรียนรู้
vocab_size = 100000
embedding_dim = 64
max_length = 10000
trunc_type = 'post'
padding_type = 'post'
oov_tok = "<UNKNOWN>"

"""
vocab_size:ลองเพิ่มหรือลดจำนวนคำใน vocabulary (vocab_size). ถ้าข้อมูลของคุณมีคำที่หลากหลายมาก, อาจต้องการเพิ่ม vocab_size.
embedding_dim:ลองเพิ่มหรือลดจำนวนมิติใน word embeddings. ค่าที่สูงกว่าส่วนใหญ่อาจช่วยให้โมเดลเรียนรู้ลักษณะข้อมูลที่ซับซ้อนขึ้น, แต่ก็ทำให้โมเดลใหญ่ขึ้น.
max_length:ลองปรับความยาวของ sequence ที่ถูกใช้ในการ pad หรือ truncate. การลองเปลี่ยนค่านี้อาจช่วยให้โมเดลเข้าใจ context ของประโยคได้ดีขึ้น.
trunc_type และ padding_type:ลองเปลี่ยนแปลงวิธีที่ทำการ truncate หรือ pad. บางครั้ง, การตัดทิ้งที่ 'pre' หรือการเติม '<PAD>' ที่ 'pre' อาจมีผลต่อการเรียนรู้.
oov_tok:ลองใช้คำนำหน้า '<OOV>' ที่แตกต่าง. บางครั้ง, การใช้คำนำหน้าที่สื่อความหมายเกี่ยวกับข้อมูลของคุณอาจช่วยให้โมเดลเรียนรู้ได้ดีขึ้น.
"""

# Tokenization
tokenizer = Tokenizer(num_words=vocab_size, oov_token=oov_tok)
tokenizer.fit_on_texts(sentences)
word_index = tokenizer.word_index
sequences = tokenizer.texts_to_sequences(sentences)
padded = pad_sequences(sequences, maxlen=max_length,
                       padding=padding_type, truncating=trunc_type)

# Model
model = Sequential()
model.add(Embedding(vocab_size, embedding_dim, input_length=max_length))
model.add(Bidirectional(LSTM(64)))
model.add(Dense(1, activation='sigmoid'))

model.compile(loss='binary_crossentropy',
              optimizer='adam', metrics=['accuracy'])

# Training
# ตรวจสอบชนิดข้อมูลและแปลงเป็น NumPy array ถ้าไม่ได้
if not isinstance(padded, np.ndarray):
    padded = np.array(padded)

# ส่งเข้าไปใน model.fit()
model.fit(padded, np.array(labels), epochs=10)
model.save('sentiment_model.h5')
