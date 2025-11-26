"""
Script to populate the database with content from the Excel file
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'ailo_db')]

# Complete Excel data extracted
excel_data = [
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "0.0",
        "Topic_Title": "Chapter Overview",
        "Subtopic_Title": "Summary & Objectives",
        "Subtopic_Name": "0.0_MC1",
        "Microcontent_ID": "0.0_MC1",
        "Microcontent_Text": "Python Programming-II revises NumPy and Pandas, CSV handling, missing-value treatment and introduces a hands-on Linear Regression activity to prepare students for data analysis and capstone projects.",
        "Content_Type": "text",
        "Related_Code_or_Image_Ref": None,
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "Think of this unit as a revision toolkit plus a small project that sharpens your tools before you build a bigger machine.",
        "Story_Explanation": "A student team is about to start a science fair project; this chapter is their short bootcamp that refreshes Python data tools and shows them how to build a simple prediction model.",
        "QA_Pair": "Q: What are the main themes of Unit 1? A: Revising NumPy and Pandas, working with CSV data, handling missing values, and implementing a basic Linear Regression model."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "0.1",
        "Topic_Title": "Learning Objectives",
        "Subtopic_Title": None,
        "Subtopic_Name": "0.1_MC1",
        "Microcontent_ID": "0.1_MC1",
        "Microcontent_Text": "By the end of the unit, students should be able to use NumPy and Pandas for data manipulation, import and export CSV data, and implement a Linear Regression algorithm including data preparation and training.",
        "Content_Type": "text",
        "Related_Code_or_Image_Ref": None,
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "The objectives are like a checklist of moves you must master before playing a full game of chess.",
        "Story_Explanation": "A teacher shares a roadmap on the board showing how today's practice with arrays and DataFrames will end with students teaching a computer to predict house prices.",
        "QA_Pair": "Q: Which three big skills are targeted in the learning objectives? A: Recap NumPy and Pandas, import/export CSV data, and implement Linear Regression."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.1",
        "Topic_Title": "Python Libraries",
        "Subtopic_Title": "Definition of Libraries",
        "Subtopic_Name": "1.1_MC1",
        "Microcontent_ID": "1.1_MC1",
        "Microcontent_Text": "Python libraries are collections of pre-written code (functions and methods) that help perform common tasks so programmers do not need to write everything from scratch.",
        "Content_Type": "text",
        "Related_Code_or_Image_Ref": None,
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "A library is like a toolbox where each tool is a ready-made function you can use instead of building the tool yourself.",
        "Story_Explanation": "Priya wants to calculate statistics on exam scores; instead of writing her own math formulas, she opens a 'Python toolbox' called a library and picks ready-made functions.",
        "QA_Pair": "Q: Why do we use Python libraries? A: They provide reusable code for common tasks and save us from rewriting logic from scratch."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.1",
        "Topic_Title": "Python Libraries",
        "Subtopic_Title": "Role of NumPy and Pandas",
        "Subtopic_Name": "1.1_MC2",
        "Microcontent_ID": "1.1_MC2",
        "Microcontent_Text": "In data science and analytics, NumPy and Pandas are core libraries that enable efficient numerical computing and data manipulation, forming the backbone for handling large datasets in Python.",
        "Content_Type": "text",
        "Related_Code_or_Image_Ref": None,
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "NumPy and Pandas are like the calculator and spreadsheet that every data detective carries around.",
        "Story_Explanation": "An AI startup uses NumPy to crunch numbers and Pandas to organize customer data into tidy tables before training any models.",
        "QA_Pair": "Q: Why are NumPy and Pandas considered backbone libraries in data science? A: Because they handle numerical arrays and labeled tabular data efficiently, which are central to most analysis tasks."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.1.1",
        "Topic_Title": "NumPy Library",
        "Subtopic_Title": "Definition and Rank",
        "Subtopic_Name": "1.1.1_MC1",
        "Microcontent_ID": "1.1.1_MC1",
        "Microcontent_Text": "NumPy (Numerical Python) is a powerful array-processing library for numerical computing in Python; the number of dimensions of a NumPy array is called its rank.",
        "Content_Type": "text",
        "Related_Code_or_Image_Ref": None,
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "A NumPy array is like a neatly arranged grid or multi-layered cube of numbers, and the rank tells you how many directions you can move in that grid.",
        "Story_Explanation": "While analysing climate data, a student stores daily temperatures for different cities and years in a 3D NumPy array whose rank is three.",
        "QA_Pair": "Q: What does the rank of a NumPy array represent? A: It represents the number of dimensions in the array."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.1.2",
        "Topic_Title": "Pandas Library",
        "Subtopic_Title": "Use Case in AI",
        "Subtopic_Name": "1.1.2_MC1",
        "Microcontent_ID": "1.1.2_MC1",
        "Microcontent_Text": "Pandas is used in AI and analytics to load datasets, compute summary statistics, perform group-wise analysis, and support visualisation workflows such as analysing marketing campaigns and their performance.",
        "Content_Type": "text",
        "Related_Code_or_Image_Ref": "Case Study 3 (marketing dataset)",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "Pandas acts like a smart spreadsheet that lets you filter, group, and summarise data with just a few commands.",
        "Story_Explanation": "A company runs several online ad campaigns; using Pandas, their analyst groups data by campaign type and finds which ads bring the most sales.",
        "QA_Pair": "Q: Name two tasks you can do with Pandas on a marketing dataset. A: Load the data and compute summary statistics or group results by campaign type to compare performance."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.1.2.1",
        "Topic_Title": "Pandas Data Structures",
        "Subtopic_Title": "Series and DataFrame Overview",
        "Subtopic_Name": "Series, DataFrame",
        "Microcontent_ID": "1.1.2.1_MC1",
        "Microcontent_Text": "Pandas provides two main data structures: Series, a one-dimensional labeled array, and DataFrame, a two-dimensional labeled table of rows and columns.",
        "Content_Type": "text",
        "Related_Code_or_Image_Ref": None,
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "A Series is like a single column in a spreadsheet, while a DataFrame is like the whole spreadsheet with multiple columns.",
        "Story_Explanation": "To store exam scores, a teacher first keeps Maths marks in a Series, then combines marks from all subjects into a single DataFrame.",
        "QA_Pair": "Q: What are the two primary data structures in Pandas? A: Series and DataFrame."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.1.2.1",
        "Topic_Title": "Pandas Data Structures",
        "Subtopic_Title": "Creating Series from Scalar",
        "Subtopic_Name": "1.1.2.1_MC2",
        "Microcontent_ID": "1.1.2.1_MC2",
        "Microcontent_Text": "A Pandas Series can be created from scalar values by passing the scalar and an index list, resulting in the same scalar repeated for each index label.",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: Series from scalar (p.4)",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "It's like copying one default score to every student until you have real marks.",
        "Story_Explanation": "While setting up a DataFrame, a teacher temporarily assigns all students a default attendance value of 100 using a scalar-based Series.",
        "QA_Pair": "Q: What happens when you create a Series from a scalar value and an index list? A: The scalar value is repeated for each index, forming the Series."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.1.2.1",
        "Topic_Title": "Pandas Data Structures",
        "Subtopic_Title": "DataFrame from NumPy Arrays",
        "Subtopic_Name": "1.1.2.1_MC3",
        "Microcontent_ID": "1.1.2.1_MC3",
        "Microcontent_Text": "A DataFrame can be created from NumPy arrays by passing a list of arrays and specifying column names, turning raw numerical arrays into a labeled table.",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: marksDF from array1/2/3 (p.4)",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "It's like taking rows of numbers from your notebook and sticking them into a table with clear column headings.",
        "Story_Explanation": "A student keeps three separate NumPy arrays for test scores and then converts them into one DataFrame called marksDF for easier analysis.",
        "QA_Pair": "Q: Why create a DataFrame from NumPy arrays? A: To get a labeled, tabular representation of numerical data that is easier to explore and manipulate."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.1.2.1",
        "Topic_Title": "Pandas Data Structures",
        "Subtopic_Title": "DataFrame from Dictionary of Lists",
        "Subtopic_Name": "1.1.2.1_MC4",
        "Microcontent_ID": "1.1.2.1_MC4",
        "Microcontent_Text": "When a dictionary of lists is passed to pd.DataFrame, dictionary keys become column labels and each list becomes a column of data.",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: df from data dict (p.4), Case Study 2 (sales.csv)",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "Imagine each key in the dictionary as a column title and each list as the column's values stacked vertically.",
        "Story_Explanation": "A sales manager stores product names and prices in lists inside a dictionary, then turns it into a DataFrame to calculate total sales easily.",
        "QA_Pair": "Q: In a DataFrame created from a dictionary of lists, what do the dictionary keys represent? A: They become column labels in the DataFrame."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.1.2.1",
        "Topic_Title": "Pandas Data Structures",
        "Subtopic_Title": "DataFrame from List of Dictionaries",
        "Subtopic_Name": "1.1.2.1_MC5",
        "Microcontent_ID": "1.1.2.1_MC5",
        "Microcontent_Text": "A list of dictionaries passed to pd.DataFrame creates one row per dictionary, combining all keys into columns and filling missing entries with NaN.",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: listDict example (p.5)",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "Each dictionary is like a filled-out form; stacking the forms makes a table where each question becomes a column.",
        "Story_Explanation": "Customer feedback forms are stored as dictionaries; combining them into a DataFrame lets the team see all responses side by side.",
        "QA_Pair": "Q: How many rows are in a DataFrame built from a list of dictionaries? A: As many rows as there are dictionaries in the list."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.1.2.2",
        "Topic_Title": "Dealing with Rows and Columns",
        "Subtopic_Title": "Adding a New Column",
        "Subtopic_Name": "1.1.2.2_MC1",
        "Microcontent_ID": "1.1.2.2_MC1",
        "Microcontent_Text": "A new column can be added to a DataFrame by assigning a list or Series to a new column label, for example Result['Fathima'] = [89, 78, 76].",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: ResultSheet and Fathima column (p.5)",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "It's like adding a new subject column to a marks sheet and writing each student's score in that new column.",
        "Story_Explanation": "After late admissions, the teacher adds a Fathima column to the marks Result DataFrame and fills in her subject scores.",
        "QA_Pair": "Q: How do you add a new column named 'Fathima' to the Result DataFrame? A: Use Result['Fathima'] = [values list]."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.1.2.2",
        "Topic_Title": "Dealing with Rows and Columns",
        "Subtopic_Title": "Adding a New Row and Updating Rows",
        "Subtopic_Name": "1.1.2.2_MC2",
        "Microcontent_ID": "1.1.2.2_MC2",
        "Microcontent_Text": "DataFrame.loc can be used to add a new row by assigning a list of values to a new index label and to update existing rows such as changing all Science marks by assigning a new list to Result.loc['Science'].",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: Result.loc['English'], Result.loc['Science'] (p.5-6)",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "loc is like writing or editing an entire row in one shot on a marks register.",
        "Story_Explanation": "When English is added as a subject, the teacher writes a full new row of marks using Result.loc['English'], later correcting Science scores using loc again.",
        "QA_Pair": "Q: Which DataFrame method lets you add or modify a row by its label? A: The .loc indexer."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.1.2.3",
        "Topic_Title": "Deleting Rows or Columns",
        "Subtopic_Title": "Using drop with axis",
        "Subtopic_Name": "1.1.2.3_MC1",
        "Microcontent_ID": "1.1.2.3_MC1",
        "Microcontent_Text": "The DataFrame.drop() method removes rows when axis=0 and columns when axis=1, e.g., Result.drop('Hindi', axis=0) deletes a row and Result.drop(['Rajat','Meenakshi'], axis=1) deletes multiple columns.",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: Result.drop examples (p.6), Case Study 4",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "drop is like erasing an entire row or column from a paper table instead of clearing individual cells.",
        "Story_Explanation": "To simplify his analysis, a student drops the Hindi row and some student columns from the Result DataFrame before computing averages.",
        "QA_Pair": "Q: How do you delete a column called 'Rajat' from a DataFrame using drop? A: Use Result = Result.drop(['Rajat'], axis=1)."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.1.2.4",
        "Topic_Title": "Attributes of DataFrames",
        "Subtopic_Title": "index and columns",
        "Subtopic_Name": "1.1.2.4_MC1",
        "Microcontent_ID": "1.1.2.4_MC1",
        "Microcontent_Text": "The df.index attribute returns the row labels of a DataFrame, while df.columns returns the column labels.",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: df.index, df.columns (p.7)",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "index is like the names of rows on the left of a table and columns is like the titles at the top.",
        "Story_Explanation": "When debugging mismatched data, Neha prints df.index and df.columns to check that the labels are what she expects.",
        "QA_Pair": "Q: What does df.columns show? A: It shows the labels of all columns in the DataFrame."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.1.2.4",
        "Topic_Title": "Attributes of DataFrames",
        "Subtopic_Title": "shape, head, tail",
        "Subtopic_Name": "1.1.2.4_MC2",
        "Microcontent_ID": "1.1.2.4_MC2",
        "Microcontent_Text": "df.shape returns a tuple with the number of rows and columns; df.head(n) displays the first n rows and df.tail(n) displays the last n rows of the DataFrame.",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: df.shape, df.head(2), df.tail(2) (p.7)",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "shape tells you how big the table is, while head and tail let you peek at the top or bottom of the table without scrolling through everything.",
        "Story_Explanation": "Before modelling, Rahul checks df.shape to know dataset size and uses head(5) to quickly inspect the first few records for correctness.",
        "QA_Pair": "Q: What does df.shape return for a DataFrame with 4 rows and 3 columns? A: The tuple (4, 3)."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.2",
        "Topic_Title": "Import and Export Data between CSV Files and DataFrames",
        "Subtopic_Title": "Understanding CSV Files",
        "Subtopic_Name": "1.2_MC1",
        "Microcontent_ID": "1.2_MC1",
        "Microcontent_Text": "A CSV (Comma-Separated Values) file stores tabular data as plain text where each line is a row and values are separated by commas, making it simple and widely used for data exchange.",
        "Content_Type": "text",
        "Related_Code_or_Image_Ref": "Case Study 2",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "A CSV file is like a simple notebook where each row is written on a new line and commas act as the grid lines between columns.",
        "Story_Explanation": "A school exports the marks list from their software as a CSV file so it can be opened both in Excel and in a Python notebook.",
        "QA_Pair": "Q: How are columns separated in a CSV file? A: By commas."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.2.1",
        "Topic_Title": "Importing a CSV file to a DataFrame",
        "Subtopic_Title": "Using read_csv",
        "Subtopic_Name": "1.2.1_MC1",
        "Microcontent_ID": "1.2.1_MC1",
        "Microcontent_Text": "Pandas.read_csv('filename.csv') reads tabular CSV data into a DataFrame where each column becomes a Series with appropriate labels.",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: df = pd.read_csv('studentsmarks.csv') (p.8-9), Case Study 2",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "It's like taking a CSV file and instantly turning it into a spreadsheet you can programmatically control.",
        "Story_Explanation": "To analyse student performance, Akshita loads 'studentsmarks.csv' using pd.read_csv and quickly sees all marks as a DataFrame.",
        "QA_Pair": "Q: Which Pandas function is commonly used to load CSV files? A: pd.read_csv()."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.2.1",
        "Topic_Title": "Importing a CSV file to a DataFrame",
        "Subtopic_Title": "Colab Upload Steps",
        "Subtopic_Name": "1.2.1_MC2",
        "Microcontent_ID": "1.2.1_MC2",
        "Microcontent_Text": "In Google Colab, students upload a CSV by opening the folder pane, clicking the upload icon, selecting the file, and then reading it with pd.read_csv in the notebook.",
        "Content_Type": "image+text",
        "Related_Code_or_Image_Ref": "Image: Colab upload steps and df preview (p.8)",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "Uploading a CSV to Colab is like putting a book on your desk before you open and read it in Python.",
        "Story_Explanation": "Riya follows the highlighted steps in Colab screenshots to upload 'studentsmarks.csv' and confirms the DataFrame output matches her expectations.",
        "QA_Pair": "Q: After uploading a CSV file in Colab, what is the next step to turn it into a DataFrame? A: Call pd.read_csv with the uploaded file name."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.2.2",
        "Topic_Title": "Exporting a DataFrame to a CSV file",
        "Subtopic_Title": "Using to_csv",
        "Subtopic_Name": "1.2.2_MC1",
        "Microcontent_ID": "1.2.2_MC1",
        "Microcontent_Text": "The DataFrame.to_csv() method writes a DataFrame to a CSV file; specifying a file path and separator saves data with row labels and column headers, while index=False omits index labels.",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: df.to_csv('C:/PANDAS/resultout.csv'), df.to_csv('resultout.csv', index=False) (p.9), Case Study 2",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "to_csv is like exporting your cleaned spreadsheet back into a portable file you can email or upload.",
        "Story_Explanation": "After computing total sales, the analyst saves the summary DataFrame to 'resultout.csv' so that non-programmer teammates can open it in Excel.",
        "QA_Pair": "Q: What argument do you pass to to_csv to avoid writing the DataFrame's index? A: index=False."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.3",
        "Topic_Title": "Handling Missing Values",
        "Subtopic_Title": "Strategies Overview",
        "Subtopic_Name": "1.3_MC1",
        "Microcontent_ID": "1.3_MC1",
        "Microcontent_Text": "Two common strategies for handling missing values are dropping rows that contain them and estimating or filling the missing entries with replacement values.",
        "Content_Type": "text",
        "Related_Code_or_Image_Ref": "Case Study 1, Case Study 4",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "Missing values are like blank exam answers; you can either ignore those papers or reasonably guess the missing marks based on other information.",
        "Story_Explanation": "A data scientist notices some customers have no age recorded and must decide whether to drop those records or fill in ages using averages.",
        "QA_Pair": "Q: Name the two broad approaches to deal with missing values. A: Drop the affected rows or estimate and fill the missing values."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.3",
        "Topic_Title": "Handling Missing Values",
        "Subtopic_Title": "Detecting Missing Values with isnull",
        "Subtopic_Name": "1.3_MC2",
        "Microcontent_ID": "1.3_MC2",
        "Microcontent_Text": "Pandas.isnull() applied to a DataFrame returns True where values are missing and False elsewhere, and combining it with sum() can count the total number of missing entries.",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: marks.isnull(), marks.isnull().sum().sum() (p.10-11), Case Study 1, Case Study 4",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "isnull is like using a highlighter that marks every empty cell in a table so you can see where information is missing.",
        "Story_Explanation": "After loading exam data, Shefali runs marks.isnull() and sees three True entries, confirming three scores were not recorded.",
        "QA_Pair": "Q: How can you find the total number of missing values in a DataFrame? A: Use df.isnull().sum().sum()."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.3",
        "Topic_Title": "Handling Missing Values",
        "Subtopic_Title": "dropna and fillna",
        "Subtopic_Name": "1.3_MC3",
        "Microcontent_ID": "1.3_MC3",
        "Microcontent_Text": "dropna() removes entire rows with missing values, reducing dataset size, while fillna(value) replaces missing entries with a specified estimate such as 0, 1, or a mean value.",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: drop = marks.dropna(); FillZero = marks.fillna(0) (p.11), Case Study 1",
        "Exercises_Ref": None,
        "Activities_Ref": None,
        "Analogy_Explanation": "dropna is like discarding incomplete survey forms, whereas fillna is like filling in blanks with a reasonable guess.",
        "Story_Explanation": "To build a model, Joseph first uses dropna to keep only rows with complete marks, then later experiments with fillna(0) to see how results change if missing marks are treated as zero.",
        "QA_Pair": "Q: When would you prefer fillna over dropna? A: When you want to keep as many records as possible and can reasonably estimate the missing values."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.4",
        "Topic_Title": "Case Study on Missing Marks",
        "Subtopic_Title": "Constructing the DataFrame",
        "Subtopic_Name": "1.4_MC1",
        "Microcontent_ID": "1.4_MC1",
        "Microcontent_Text": "A marks DataFrame is created with subjects Maths, Science, English, Hindi and AI for six students, where some entries are explicitly set to np.NaN to represent missed exams or events.",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: ResultSheet and marks DataFrame (p.10)",
        "Exercises_Ref": None,
        "Activities_Ref": "Case Study 1",
        "Analogy_Explanation": "Here NaN values act like blank spaces in a report card when a student missed an exam.",
        "Story_Explanation": "Because Meera and Suhana missed certain exams and Joseph attended a science exhibition, their marks table contains NaNs instead of scores for those subjects.",
        "QA_Pair": "Q: Why are some entries in the marks DataFrame set to np.NaN? A: To indicate subjects where students did not take the exam or marks are unavailable."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.4",
        "Topic_Title": "Case Study on Missing Marks",
        "Subtopic_Title": "Analysing Missing Data",
        "Subtopic_Name": "1.4_MC2",
        "Microcontent_ID": "1.4_MC2",
        "Microcontent_Text": "Using marks.isnull(), marks['Science'].isnull().any(), and marks.isnull().sum().sum(), students confirm that only some subjects for specific students are missing and that there are exactly three NaN values in the dataset.",
        "Content_Type": "code",
        "Related_Code_or_Image_Ref": "Code: isnull checks and counts (p.11)",
        "Exercises_Ref": None,
        "Activities_Ref": "Case Study 1",
        "Analogy_Explanation": "This is like checking each column of a class register to count how many blank marks appear in total and in a specific subject.",
        "Story_Explanation": "The teacher verifies where marks are absent and confirms there are exactly three missing entries, helping decide whether to drop or fill them.",
        "QA_Pair": "Q: What does marks['Science'].isnull().any() returning True indicate? A: That at least one Science mark is missing."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.5",
        "Topic_Title": "Practical Activity – Linear Regression",
        "Subtopic_Title": "Loading and Exploring USA_Housing Data",
        "Subtopic_Name": "1.5_MC1",
        "Microcontent_ID": "1.5_MC1",
        "Microcontent_Text": "In the Linear Regression activity, students load 'USA_Housing.csv' with pd.read_csv, view the first rows using df.head(), and generate descriptive statistics with df.describe(), confirming that all columns contain 5000 non-missing values.",
        "Content_Type": "code+image",
        "Related_Code_or_Image_Ref": "Code and outputs on p.12 (head, describe)",
        "Exercises_Ref": None,
        "Activities_Ref": "Practical Activity 1.5",
        "Analogy_Explanation": "This is like opening a big housing-price notebook and skimming the first few pages plus a summary sheet before doing any math.",
        "Story_Explanation": "Before predicting house prices, students quickly inspect the dataset and see there are 5000 complete records with no missing values.",
        "QA_Pair": "Q: Which function gives a quick statistical summary of each numeric column? A: df.describe()."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.5",
        "Topic_Title": "Practical Activity – Linear Regression",
        "Subtopic_Title": "Preparing Features and Splitting Data",
        "Subtopic_Name": "1.5_MC2",
        "Microcontent_ID": "1.5_MC2",
        "Microcontent_Text": "Students drop the 'Address' column as irrelevant, separate feature matrix X and target y using df.drop(['Price'], axis=1) and df['Price'], and then use train_test_split with test_size=0.20 so that 80% (4000 rows) are used for training and 20% (1000 rows) for testing.",
        "Content_Type": "code+image",
        "Related_Code_or_Image_Ref": "Code: df.drop('Address'), train_test_split, x_train.shape (p.12-13)",
        "Exercises_Ref": None,
        "Activities_Ref": "Practical Activity 1.5",
        "Analogy_Explanation": "This is like separating your study notes into inputs and answers, then using 80% for learning and keeping 20% hidden for self-testing later.",
        "Story_Explanation": "To build a clean training set, the class removes the address text and splits the remaining numeric columns into training and testing sets with a clear 80–20 ratio.",
        "QA_Pair": "Q: What is the purpose of train_test_split with test_size=0.20? A: To randomly divide data so 80% is used to train the model and 20% to evaluate it."
    },
    {
        "Chapter_Name": "Unit 1: Python Programming-II",
        "Topic_Number": "1.5",
        "Topic_Title": "Practical Activity – Linear Regression",
        "Subtopic_Title": "Training Model and Predicting Prices",
        "Subtopic_Name": "1.5_MC3",
        "Microcontent_ID": "1.5_MC3",
        "Microcontent_Text": "Using LinearRegression from sklearn.linear_model, students fit the model on x_train and y_train, then call m.predict(x_test) to obtain an array of predicted house prices for the test data.",
        "Content_Type": "code+image",
        "Related_Code_or_Image_Ref": "Code: LinearRegression(), m.fit, m.predict (p.14)",
        "Exercises_Ref": None,
        "Activities_Ref": "Practical Activity 1.5",
        "Analogy_Explanation": "Training the model is like teaching a student with many examples, and predicting is like asking the student to guess new answers based on what they learned.",
        "Story_Explanation": "After learning patterns between house features and prices, the Linear Regression model predicts prices for 1000 unseen houses, which the class later compares with actual values.",
        "QA_Pair": "Q: Which function is used to generate predictions from a trained Linear Regression model? A: m.predict(x_test)."
    }
]


async def populate_database():
    """Populate the database with structured content from Excel data"""
    
    print("Starting database population...")
    
    # Clear existing content collections
    print("Clearing existing collections...")
    await db.chapters.delete_many({})
    await db.topics.delete_many({})
    await db.subtopics.delete_many({})
    await db.microcontent.delete_many({})
    await db.quiz_questions.delete_many({})
    
    # Process data and create hierarchical structure
    chapters_dict = {}
    topics_dict = {}
    subtopics_dict = {}
    
    for row in excel_data:
        chapter_name = row["Chapter_Name"]
        topic_number = row["Topic_Number"]
        topic_title = row["Topic_Title"]
        subtopic_title = row["Subtopic_Title"]
        
        # Create Chapter
        if chapter_name not in chapters_dict:
            chapter_id = str(uuid.uuid4())
            chapters_dict[chapter_name] = {
                "chapter_id": chapter_id,
                "chapter_name": chapter_name,
                "title": chapter_name,
                "description": f"Learn about {chapter_name}",
                "order": 1,
                "locked": False,
                "icon": "📚"
            }
        
        chapter_id = chapters_dict[chapter_name]["chapter_id"]
        
        # Create Topic
        topic_key = f"{chapter_name}|{topic_number}|{topic_title}"
        if topic_key not in topics_dict:
            topic_id = str(uuid.uuid4())
            topics_dict[topic_key] = {
                "topic_id": topic_id,
                "chapter_id": chapter_id,
                "topic_number": topic_number,
                "topic_title": topic_title,
                "title": topic_title,
                "description": f"Explore {topic_title}",
                "order": float(topic_number) if topic_number else 0,
                "locked": False
            }
        
        topic_id = topics_dict[topic_key]["topic_id"]
        
        # Create Subtopic (if exists)
        if subtopic_title:
            subtopic_key = f"{topic_key}|{subtopic_title}"
            if subtopic_key not in subtopics_dict:
                subtopic_id = str(uuid.uuid4())
                subtopics_dict[subtopic_key] = {
                    "subtopic_id": subtopic_id,
                    "topic_id": topic_id,
                    "chapter_id": chapter_id,
                    "subtopic_title": subtopic_title,
                    "subtopic_name": row["Subtopic_Name"],
                    "title": subtopic_title,
                    "order": len([k for k in subtopics_dict.keys() if k.startswith(topic_key)]) + 1,
                    "microcontent_count": 0
                }
            
            subtopic_id = subtopics_dict[subtopic_key]["subtopic_id"]
            subtopics_dict[subtopic_key]["microcontent_count"] += 1
        else:
            # If no subtopic, use topic as subtopic
            subtopic_key = f"{topic_key}|{topic_title}"
            if subtopic_key not in subtopics_dict:
                subtopic_id = str(uuid.uuid4())
                subtopics_dict[subtopic_key] = {
                    "subtopic_id": subtopic_id,
                    "topic_id": topic_id,
                    "chapter_id": chapter_id,
                    "subtopic_title": topic_title,
                    "subtopic_name": row["Subtopic_Name"],
                    "title": topic_title,
                    "order": 1,
                    "microcontent_count": 0
                }
            
            subtopic_id = subtopics_dict[subtopic_key]["subtopic_id"]
            subtopics_dict[subtopic_key]["microcontent_count"] += 1
        
        # Create Microcontent
        microcontent_doc = {
            "microcontent_id": row["Microcontent_ID"],
            "subtopic_id": subtopic_id,
            "topic_id": topic_id,
            "chapter_id": chapter_id,
            "microcontent_text": row["Microcontent_Text"],
            "content_type": row["Content_Type"],
            "story_explanation": row["Story_Explanation"],
            "analogy_explanation": row["Analogy_Explanation"],
            "core_text": row["Microcontent_Text"],  # Why mode
            "related_code": row["Related_Code_or_Image_Ref"],
            "qa_pair": row["QA_Pair"],
            "order": int(row["Microcontent_ID"].split("_MC")[-1]) if "_MC" in row["Microcontent_ID"] else 1
        }
        
        await db.microcontent.insert_one(microcontent_doc)
        
        # Generate quiz questions for this subtopic
        if row["QA_Pair"]:
            # Parse Q&A pair
            qa_parts = row["QA_Pair"].split("A:")
            if len(qa_parts) == 2:
                question_text = qa_parts[0].replace("Q:", "").strip()
                correct_answer = qa_parts[1].strip()
                
                # Generate 3 distractors
                distractors = [
                    "This is a distractor option",
                    "Another incorrect option",
                    "Yet another wrong answer"
                ]
                
                options = [correct_answer] + distractors
                import random
                random.shuffle(options)
                
                correct_index = options.index(correct_answer)
                
                quiz_question = {
                    "question_id": str(uuid.uuid4()),
                    "subtopic_id": subtopic_id,
                    "topic_id": topic_id,
                    "chapter_id": chapter_id,
                    "question_text": question_text,
                    "options": options,
                    "correct_answer": correct_answer,
                    "correct_index": correct_index,
                    "difficulty": "medium",
                    "explanation": row["Microcontent_Text"][:200]
                }
                
                await db.quiz_questions.insert_one(quiz_question)
    
    # Insert all chapters
    print(f"Inserting {len(chapters_dict)} chapters...")
    if chapters_dict:
        await db.chapters.insert_many(list(chapters_dict.values()))
    
    # Insert all topics
    print(f"Inserting {len(topics_dict)} topics...")
    if topics_dict:
        await db.topics.insert_many(list(topics_dict.values()))
    
    # Insert all subtopics
    print(f"Inserting {len(subtopics_dict)} subtopics...")
    if subtopics_dict:
        await db.subtopics.insert_many(list(subtopics_dict.values()))
    
    print("✅ Database population complete!")
    print(f"   - Chapters: {len(chapters_dict)}")
    print(f"   - Topics: {len(topics_dict)}")
    print(f"   - Subtopics: {len(subtopics_dict)}")
    print(f"   - Microcontent: {len(excel_data)}")
    
    # Print sample data
    print("\n📊 Sample Chapter:")
    sample_chapter = await db.chapters.find_one()
    if sample_chapter:
        print(f"   {sample_chapter['title']}")
    
    print("\n📊 Sample Topic:")
    sample_topic = await db.topics.find_one()
    if sample_topic:
        print(f"   {sample_topic['title']}")
    
    print("\n📊 Sample Subtopic:")
    sample_subtopic = await db.subtopics.find_one()
    if sample_subtopic:
        print(f"   {sample_subtopic['title']}")


if __name__ == "__main__":
    asyncio.run(populate_database())
