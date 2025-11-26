"""
Generate quiz questions for Practice Tab using GPT
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'ailo_db')]

# Quiz questions data for different chapters
quiz_questions_data = [
    # Chapter 1: Introduction to AI
    {
        "chapter": "Introduction to AI",
        "chapter_number": 1,
        "questions": [
            {
                "question_text": "What is Artificial Intelligence (AI)?",
                "options": [
                    "A computer program that can think like humans",
                    "The simulation of human intelligence by machines",
                    "A robot that can walk and talk",
                    "A type of computer hardware"
                ],
                "correct_answer": "The simulation of human intelligence by machines",
                "explanation": "AI is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.",
                "difficulty": "easy",
                "topic": "AI Basics"
            },
            {
                "question_text": "Which of the following is NOT a typical application of AI?",
                "options": [
                    "Voice assistants like Siri and Alexa",
                    "Self-driving cars",
                    "Traditional calculator operations",
                    "Recommendation systems on Netflix"
                ],
                "correct_answer": "Traditional calculator operations",
                "explanation": "Traditional calculators perform predetermined mathematical operations without learning or adapting, which are key characteristics of AI systems.",
                "difficulty": "easy",
                "topic": "AI Applications"
            },
            {
                "question_text": "What is the main goal of Artificial Intelligence?",
                "options": [
                    "To replace all human workers",
                    "To create machines that can perform tasks requiring human intelligence",
                    "To make computers faster",
                    "To increase internet speed"
                ],
                "correct_answer": "To create machines that can perform tasks requiring human intelligence",
                "explanation": "The main goal of AI is to create systems that can perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.",
                "difficulty": "easy",
                "topic": "AI Goals"
            },
            {
                "question_text": "Which of these is an example of 'Narrow AI' or 'Weak AI'?",
                "options": [
                    "A superintelligent robot from science fiction",
                    "A chess-playing program",
                    "Human-level general intelligence",
                    "A sentient computer system"
                ],
                "correct_answer": "A chess-playing program",
                "explanation": "Narrow AI (Weak AI) is designed to perform a specific task, like playing chess. It cannot transfer its knowledge to other domains, unlike general AI.",
                "difficulty": "medium",
                "topic": "Types of AI"
            },
            {
                "question_text": "What distinguishes 'Strong AI' from 'Weak AI'?",
                "options": [
                    "Strong AI is faster than Weak AI",
                    "Strong AI can understand and learn any intellectual task that a human can",
                    "Strong AI uses more powerful computers",
                    "Strong AI is only used in robotics"
                ],
                "correct_answer": "Strong AI can understand and learn any intellectual task that a human can",
                "explanation": "Strong AI (General AI) refers to systems that possess the ability to understand, learn, and apply intelligence across a wide range of tasks, similar to human intelligence. This doesn't exist yet.",
                "difficulty": "medium",
                "topic": "Types of AI"
            },
            {
                "question_text": "Who is considered the 'Father of Artificial Intelligence'?",
                "options": [
                    "Alan Turing",
                    "John McCarthy",
                    "Bill Gates",
                    "Steve Jobs"
                ],
                "correct_answer": "John McCarthy",
                "explanation": "John McCarthy coined the term 'Artificial Intelligence' in 1956 and is widely regarded as the father of AI. Alan Turing also made foundational contributions to the field.",
                "difficulty": "medium",
                "topic": "AI History"
            },
            {
                "question_text": "What is the 'Turing Test' designed to evaluate?",
                "options": [
                    "A computer's processing speed",
                    "A machine's ability to exhibit intelligent behavior indistinguishable from a human",
                    "The accuracy of AI predictions",
                    "The efficiency of algorithms"
                ],
                "correct_answer": "A machine's ability to exhibit intelligent behavior indistinguishable from a human",
                "explanation": "The Turing Test, proposed by Alan Turing in 1950, evaluates a machine's ability to demonstrate intelligent behavior that is equivalent to, or indistinguishable from, that of a human.",
                "difficulty": "medium",
                "topic": "AI Evaluation"
            },
            {
                "question_text": "Which of the following technologies is primarily driven by AI?",
                "options": [
                    "Word processors",
                    "Facial recognition systems",
                    "Traditional databases",
                    "Email clients"
                ],
                "correct_answer": "Facial recognition systems",
                "explanation": "Facial recognition uses AI algorithms, particularly deep learning and computer vision, to identify and verify people from images or videos.",
                "difficulty": "easy",
                "topic": "AI Technologies"
            },
            {
                "question_text": "What is 'Machine Learning' in the context of AI?",
                "options": [
                    "Teaching machines to physically move",
                    "A subset of AI where systems learn from data without explicit programming",
                    "Programming robots to follow instructions",
                    "Creating hardware for computers"
                ],
                "correct_answer": "A subset of AI where systems learn from data without explicit programming",
                "explanation": "Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed for every task.",
                "difficulty": "easy",
                "topic": "Machine Learning Basics"
            },
            {
                "question_text": "Which ethical concern is commonly associated with AI development?",
                "options": [
                    "Cost of electricity",
                    "Job displacement and bias in algorithms",
                    "Color of computer screens",
                    "Size of data centers"
                ],
                "correct_answer": "Job displacement and bias in algorithms",
                "explanation": "Key ethical concerns in AI include potential job displacement due to automation, algorithmic bias that can perpetuate discrimination, privacy issues, and the need for accountability in AI decision-making.",
                "difficulty": "medium",
                "topic": "AI Ethics"
            }
        ]
    },
    # Chapter 2: Machine Learning Basics
    {
        "chapter": "Machine Learning Basics",
        "chapter_number": 2,
        "questions": [
            {
                "question_text": "What is the primary difference between traditional programming and machine learning?",
                "options": [
                    "Traditional programming is faster",
                    "In ML, the computer learns patterns from data rather than following explicit instructions",
                    "Traditional programming uses more memory",
                    "ML doesn't use any code"
                ],
                "correct_answer": "In ML, the computer learns patterns from data rather than following explicit instructions",
                "explanation": "Traditional programming involves explicitly coding rules, while machine learning allows systems to learn patterns and make decisions from data.",
                "difficulty": "easy",
                "topic": "ML Fundamentals"
            },
            {
                "question_text": "Which of the following best describes 'Supervised Learning'?",
                "options": [
                    "Learning without any human guidance",
                    "Training with labeled data where inputs are paired with correct outputs",
                    "Learning through trial and error",
                    "Clustering similar data points"
                ],
                "correct_answer": "Training with labeled data where inputs are paired with correct outputs",
                "explanation": "Supervised learning uses labeled training data, where each example includes both input features and the correct output, allowing the model to learn the relationship between them.",
                "difficulty": "easy",
                "topic": "Supervised Learning"
            },
            {
                "question_text": "What is 'Unsupervised Learning'?",
                "options": [
                    "Learning with labeled data",
                    "Finding patterns in unlabeled data",
                    "Learning through rewards and penalties",
                    "Supervised by human teachers"
                ],
                "correct_answer": "Finding patterns in unlabeled data",
                "explanation": "Unsupervised learning works with unlabeled data, discovering hidden patterns, structures, or relationships without predefined categories or outcomes.",
                "difficulty": "easy",
                "topic": "Unsupervised Learning"
            },
            {
                "question_text": "Which type of machine learning is used in game-playing AI like AlphaGo?",
                "options": [
                    "Supervised Learning",
                    "Unsupervised Learning",
                    "Reinforcement Learning",
                    "Transfer Learning"
                ],
                "correct_answer": "Reinforcement Learning",
                "explanation": "Reinforcement Learning is used in game-playing AI, where the agent learns through trial and error, receiving rewards for good moves and penalties for bad ones.",
                "difficulty": "medium",
                "topic": "Reinforcement Learning"
            },
            {
                "question_text": "What is a 'training dataset' in machine learning?",
                "options": [
                    "Data used to test the final model",
                    "Data used to teach the model patterns",
                    "Data that is never used",
                    "Data generated by the model"
                ],
                "correct_answer": "Data used to teach the model patterns",
                "explanation": "The training dataset is used to train the machine learning model, allowing it to learn patterns and relationships that it can then apply to new, unseen data.",
                "difficulty": "easy",
                "topic": "ML Datasets"
            },
            {
                "question_text": "What is 'overfitting' in machine learning?",
                "options": [
                    "When a model is too simple",
                    "When a model learns training data too well, including noise, and performs poorly on new data",
                    "When a model trains too quickly",
                    "When a model uses too little data"
                ],
                "correct_answer": "When a model learns training data too well, including noise, and performs poorly on new data",
                "explanation": "Overfitting occurs when a model is too complex and learns the training data too well, including its noise and outliers, resulting in poor generalization to new data.",
                "difficulty": "medium",
                "topic": "Model Training"
            },
            {
                "question_text": "What is a 'feature' in machine learning?",
                "options": [
                    "A bug in the code",
                    "An individual measurable property used as input to the model",
                    "The output of the model",
                    "A type of algorithm"
                ],
                "correct_answer": "An individual measurable property used as input to the model",
                "explanation": "Features are individual measurable properties or characteristics of the data that serve as inputs to a machine learning model. For example, in predicting house prices, features might include size, location, and age.",
                "difficulty": "easy",
                "topic": "ML Terminology"
            },
            {
                "question_text": "What is the purpose of a 'test dataset'?",
                "options": [
                    "To train the model",
                    "To evaluate model performance on unseen data",
                    "To store extra data",
                    "To debug the code"
                ],
                "correct_answer": "To evaluate model performance on unseen data",
                "explanation": "The test dataset is kept separate from training data and used to evaluate how well the trained model performs on new, previously unseen examples.",
                "difficulty": "easy",
                "topic": "ML Datasets"
            },
            {
                "question_text": "Which algorithm is commonly used for classification tasks?",
                "options": [
                    "Linear Regression",
                    "Decision Trees",
                    "K-Means Clustering",
                    "Principal Component Analysis"
                ],
                "correct_answer": "Decision Trees",
                "explanation": "Decision Trees are commonly used for classification tasks, where the goal is to predict a categorical label. They work by splitting data based on feature values to create decision rules.",
                "difficulty": "medium",
                "topic": "ML Algorithms"
            },
            {
                "question_text": "What does 'accuracy' measure in a classification model?",
                "options": [
                    "How fast the model runs",
                    "The proportion of correct predictions out of all predictions",
                    "The amount of data used",
                    "The complexity of the algorithm"
                ],
                "correct_answer": "The proportion of correct predictions out of all predictions",
                "explanation": "Accuracy is a metric that measures the proportion of correct predictions (both true positives and true negatives) out of the total number of predictions made by the model.",
                "difficulty": "easy",
                "topic": "ML Evaluation"
            }
        ]
    },
    # Chapter 3: Neural Networks
    {
        "chapter": "Neural Networks",
        "chapter_number": 3,
        "questions": [
            {
                "question_text": "What inspired the development of Artificial Neural Networks?",
                "options": [
                    "Computer processors",
                    "The human brain and its neurons",
                    "Internet networks",
                    "Mathematical equations"
                ],
                "correct_answer": "The human brain and its neurons",
                "explanation": "Artificial Neural Networks are inspired by the structure and function of biological neural networks in the human brain, with interconnected nodes (neurons) that process and transmit information.",
                "difficulty": "easy",
                "topic": "Neural Network Basics"
            },
            {
                "question_text": "What is a 'neuron' in an artificial neural network?",
                "options": [
                    "A physical component of a computer",
                    "A computational unit that receives inputs, processes them, and produces an output",
                    "A type of data",
                    "A programming language"
                ],
                "correct_answer": "A computational unit that receives inputs, processes them, and produces an output",
                "explanation": "In an artificial neural network, a neuron (or node) is a computational unit that takes multiple inputs, applies weights and a bias, passes the result through an activation function, and produces an output.",
                "difficulty": "easy",
                "topic": "Neural Network Components"
            },
            {
                "question_text": "What are 'weights' in a neural network?",
                "options": [
                    "The size of the network in memory",
                    "Parameters that determine the strength of connections between neurons",
                    "The number of layers",
                    "The speed of computation"
                ],
                "correct_answer": "Parameters that determine the strength of connections between neurons",
                "explanation": "Weights are learnable parameters that determine how much influence one neuron has on another. During training, the network adjusts these weights to minimize prediction error.",
                "difficulty": "medium",
                "topic": "Neural Network Parameters"
            },
            {
                "question_text": "What is 'backpropagation' in neural networks?",
                "options": [
                    "Moving data forward through the network",
                    "An algorithm for calculating gradients and updating weights to minimize error",
                    "Removing layers from the network",
                    "Duplicating the network"
                ],
                "correct_answer": "An algorithm for calculating gradients and updating weights to minimize error",
                "explanation": "Backpropagation is a key algorithm used to train neural networks. It calculates the gradient of the loss function with respect to the weights and propagates this information backward through the network to update the weights.",
                "difficulty": "hard",
                "topic": "Training Process"
            },
            {
                "question_text": "What is the purpose of an 'activation function'?",
                "options": [
                    "To turn the network on and off",
                    "To introduce non-linearity, allowing the network to learn complex patterns",
                    "To speed up computation",
                    "To reduce the size of the network"
                ],
                "correct_answer": "To introduce non-linearity, allowing the network to learn complex patterns",
                "explanation": "Activation functions introduce non-linearity into the network, enabling it to learn and model complex, non-linear relationships in the data. Without them, neural networks would only be able to learn linear relationships.",
                "difficulty": "medium",
                "topic": "Activation Functions"
            },
            {
                "question_text": "What is a 'hidden layer' in a neural network?",
                "options": [
                    "A layer that is not visible to users",
                    "Layers between the input and output layers that process information",
                    "A layer that stores data",
                    "The last layer of the network"
                ],
                "correct_answer": "Layers between the input and output layers that process information",
                "explanation": "Hidden layers are intermediate layers between the input and output layers. They perform transformations on the data, extracting increasingly abstract features as information flows through the network.",
                "difficulty": "easy",
                "topic": "Network Architecture"
            },
            {
                "question_text": "What is 'Deep Learning'?",
                "options": [
                    "Learning from very large datasets",
                    "Machine learning using neural networks with multiple hidden layers",
                    "Learning that takes a long time",
                    "A type of unsupervised learning"
                ],
                "correct_answer": "Machine learning using neural networks with multiple hidden layers",
                "explanation": "Deep Learning refers to neural networks with multiple hidden layers (deep architectures) that can learn hierarchical representations of data, enabling them to model very complex patterns.",
                "difficulty": "easy",
                "topic": "Deep Learning"
            },
            {
                "question_text": "Which type of neural network is best for image recognition?",
                "options": [
                    "Recurrent Neural Networks (RNN)",
                    "Convolutional Neural Networks (CNN)",
                    "Simple Perceptron",
                    "Linear Regression"
                ],
                "correct_answer": "Convolutional Neural Networks (CNN)",
                "explanation": "CNNs are specifically designed for processing grid-like data such as images. They use convolutional layers that can detect spatial patterns like edges, textures, and shapes.",
                "difficulty": "medium",
                "topic": "CNN Applications"
            },
            {
                "question_text": "What is the 'learning rate' in neural network training?",
                "options": [
                    "How fast the network processes data",
                    "A hyperparameter that controls how much to adjust weights during training",
                    "The number of training examples per second",
                    "The complexity of the model"
                ],
                "correct_answer": "A hyperparameter that controls how much to adjust weights during training",
                "explanation": "The learning rate is a hyperparameter that determines the size of the steps taken when updating weights during training. Too high, and training may be unstable; too low, and training will be very slow.",
                "difficulty": "medium",
                "topic": "Training Hyperparameters"
            },
            {
                "question_text": "What problem does 'dropout' help prevent in neural networks?",
                "options": [
                    "Underfitting",
                    "Overfitting",
                    "Slow training",
                    "Data loss"
                ],
                "correct_answer": "Overfitting",
                "explanation": "Dropout is a regularization technique that randomly deactivates a portion of neurons during training, preventing the network from relying too heavily on specific neurons and reducing overfitting.",
                "difficulty": "hard",
                "topic": "Regularization"
            }
        ]
    }
]

async def populate_quiz_questions():
    """Populate the database with quiz questions"""
    print("🎯 Populating quiz questions for Practice Tab...")
    
    # Clear existing quiz questions
    await db.practice_questions.delete_many({})
    await db.chapter_quizzes.delete_many({})
    
    total_questions = 0
    
    for chapter_data in quiz_questions_data:
        chapter_name = chapter_data["chapter"]
        chapter_number = chapter_data["chapter_number"]
        questions = chapter_data["questions"]
        
        # Create chapter quiz metadata
        chapter_quiz_id = str(uuid.uuid4())
        chapter_quiz = {
            "quiz_id": chapter_quiz_id,
            "chapter_name": chapter_name,
            "chapter_number": chapter_number,
            "total_questions": len(questions),
            "time_limit": len(questions) * 60,  # 1 min per question
            "xp_reward": len(questions) * 10,
            "difficulty": "mixed",
            "type": "chapter",
            "created_at": datetime.utcnow()
        }
        await db.chapter_quizzes.insert_one(chapter_quiz)
        
        # Insert questions
        for idx, q_data in enumerate(questions):
            question = {
                "question_id": str(uuid.uuid4()),
                "quiz_id": chapter_quiz_id,
                "chapter_name": chapter_name,
                "chapter_number": chapter_number,
                "question_text": q_data["question_text"],
                "options": q_data["options"],
                "correct_answer": q_data["correct_answer"],
                "explanation": q_data["explanation"],
                "difficulty": q_data["difficulty"],
                "topic": q_data["topic"],
                "order": idx + 1,
                "created_at": datetime.utcnow()
            }
            await db.practice_questions.insert_one(question)
            total_questions += 1
        
        print(f"✅ Added {len(questions)} questions for: {chapter_name}")
    
    print(f"\n🎉 Successfully added {total_questions} quiz questions!")
    print(f"📚 Chapters: {len(quiz_questions_data)}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(populate_quiz_questions())
