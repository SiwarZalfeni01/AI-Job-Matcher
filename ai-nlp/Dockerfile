FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir flask spacy scikit-learn pandas numpy

RUN python -m spacy download en_core_web_sm
RUN python -m spacy download fr_core_news_sm

COPY app.py .

EXPOSE 5000

CMD ["python", "app.py"]
