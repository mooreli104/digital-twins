FROM python:3.13
WORKDIR /simulator

# Install the application dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy in the source code
COPY . .
EXPOSE 8080

# Setup an app user so the container doesn't run as the root user
RUN useradd simulator
USER simulator

CMD ["python", "sensor_simulator.py", "--host", "0.0.0.0", "--port", "8080"]