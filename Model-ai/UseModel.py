import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

print("กำลังทำงาน")

# โหลดโมเดลที่ฝึกเทรนไว้
model = load_model('sentiment_model.h5')

# จำนวนคำที่สูงสุดที่จะให้ Network เรียนรู้
vocab_size = 100000
embedding_dim = 64
max_length = 10000
trunc_type = 'post'
padding_type = 'post'
oov_tok = "<UNKNOWN>"

tokenizer = Tokenizer(num_words=vocab_size, oov_token=oov_tok)

# word_index ที่ถูกบันทึกไว้ในขั้นตอนการฝึกเทรน
word_index = {
    "<OOV>": 1,
    # เพิ่ม entries อื่น ๆ จาก word_index
}

tokenizer.word_index = word_index

# ข้อความตัวอย่าง
input_text = "นักแสดงหลักสองคน Erkan และ Stefan เป็นคอมเมดี้จากมิวนิค ฉันกำลังสงสัยว่านี่เป็นหนึ่งในภาพยนตร์ slapstick ทั่วไปที่เรื่องราวไม่สำคัญหรือไม่มีอยู่จริง แต่เมื่อฉันดูภาพยนตร์นี้ฉันมีความสุขมากที่มีเรื่องราวที่น่าสนใจและนักแสดงหลักเข้ากันได้จริง< br />< br />ทั้งหมดเป็นสนุกมากและไม่ใช่ภาพยนตร์เยอรมันทั่วไป"

# Tokenization
sequences = tokenizer.texts_to_sequences([input_text])
padded_input = pad_sequences(
    sequences, maxlen=max_length, padding=padding_type, truncating=trunc_type)

# ทำนาย
prediction = model.predict(padded_input)
print(prediction)
# นับว่าค่ามีความสูงกว่า 0.5 สำหรับการจำแนกแบบไบนารี
sentiment_label = "Positive" if prediction > 0.5 else "Negative"

print(f"ความรู้สึกของข้อความนี้คือ: {sentiment_label}")
