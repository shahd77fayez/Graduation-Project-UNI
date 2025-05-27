from datetime import datetime, timezone
import os
from flask import Flask , request,jsonify,session
from os import abort
from flask_session import Session
from flask_cors import CORS
from models import db,User,Article,Favorite,Comment,History
from config import ApplicationConfig
from flask_bcrypt import Bcrypt
from veracityModel import Search_and_detect,predict_Arabic_Text
from deepfake_Image import predict_image
from deepfake_video import Vidpredict
from ocr import Image_extract_english, Image_extract_arabic
from langdetect import detect
import subprocess
from sqlalchemy import desc

application = Flask(__name__)
application.config.from_object(ApplicationConfig)

bycrypt =Bcrypt(application)
cors=CORS(application,supports_credentials=True)
server_seesion=Session(application)
db.init_app(application)

with application.app_context():
    db.create_all()


@application.route("/api/signup", methods=['POST'])
def Register():
    email = request.json["email"]
    username = request.json["username"]
    password =  request.json["password"]
    print(password)
    age = request.json["age"]

    user_exists=User.query.filter_by(email=email).first() is not None
    if user_exists:
        return"user already exists"
    hashed_password= bycrypt.generate_password_hash(password).decode('utf-8')
    print(hashed_password)
    new_User= User(username=username,password=hashed_password,email=email,age=age)
    db.session.add(new_User)
    db.session.commit()

    return jsonify({
        "id":new_User.userid,
        "email":new_User.email
    })
@application.route("/api/login", methods=['POST'])
def Login():
    email = request.json["email"]
    password = request.json['password']

    user=User.query.filter_by(email=email).first()
    
    if user is None:
        return jsonify({"error":"unauthrized"}),401
    if not bycrypt.check_password_hash(user.password,password):
        return jsonify({"error":"unauthrized"}),404

    session["user_id"]=user.userid
    return jsonify({
        "id":user.userid
    })
@application.route("/api/user/profile",methods=['GET'])
def getProfile():
    user_id=session.get("user_id")
    if not user_id:
        return jsonify({'error': 'Unauthorized '}), 401
    #Retrieve a user by email:
    user= User.query.filter_by(userid=user_id).first()
    return jsonify({
        "email": user.email,
        "age":user.age,
        "bio":user.bio,
        "username":user.username,
        "password":user.password
    })
@application.route("/api/user/editProfile",methods=['POST'])
def UpdateProfile():
    user_id=session.get("user_id")
    email = request.json["email"]
    username = request.json["username"]
    bio = request.json["bio"]
    age=request.json["age"]
    if not user_id:
        return jsonify({'error': 'Unauthorized '}), 401
    user= User.query.filter_by(userid=user_id).first()
    user.username=username
    user.email=email
    user.age=age
    user.bio=bio
    if "password" in request.json and request.json["password"]:
        user.password = bycrypt.generate_password_hash(request.json["password"]).decode('utf-8')
    db.session.commit()
    return jsonify({"message": "Profile updated successfully"}), 200
@application.route("/api/getarticlesbytype", methods=['GET'])
def get_articles():
    articletype = request.args.get('type')
    lang = request.args.get('lang')
    if lang == 'en':
        articles = Article.query.filter_by(articletype=articletype, articlelang='English').order_by(desc(Article.articledate)).all()
    else:
        articles = Article.query.filter_by(articletype=articletype, articlelang='Arabic').order_by(desc(Article.articledate)).all()
        
    
    return jsonify([article.to_dict() for article in articles])
@application.route("/api/Predict", methods=['POST'])
def predict():
   user_id = session.get("user_id")
   if not user_id:
        
        request_data = request.json  # Expecting JSON payload
        text = request_data['news']
        language = detect(text)
        if language == 'en':
                choice=Search_and_detect(text)
                if choice[0]==1:
                    print("in web")
                    apiName=choice[1]
                    print(apiName)
                    title=choice[2]
                    print(title)
                    source=choice[3]
                    print(source)
                    link=choice[4]
                    print(link)
                    snippet=choice[5]
                    print(snippet)

                    return jsonify({"apiName":apiName,
                                    "title":title,
                                    "source":source,
                                    "link":link,
                                    "snippet":snippet
                                    }), 201
                elif choice[0]==2:
                    print("in model")
                    prediction=choice[1]
                    print(prediction)
                    confidence=choice[2]
                    print(confidence)
                    confidence_str=str(confidence)
                    return jsonify({'label': prediction, 'confidence':confidence_str }),200
                elif choice[0]==3:
                    return jsonify({'error': 'Language undetected'}), 205
        elif language=='ar':
                label, confidence = predict_Arabic_Text(text)
                print(label)
                print(confidence)
                confidence_str=str(confidence)
                return jsonify({'label': label, 'confidence':confidence_str }),200
   else:     
        request_data = request.json  # Expecting JSON payload
        text = request_data['news']
        language = detect(text)
        if language == 'en':
                choice=Search_and_detect(text)
                if choice[0]==1:
                    print("in web")
                    apiName=choice[1]
                    print(apiName)
                    title=choice[2]
                    print(title)
                    source=choice[3]
                    print(source)
                    link=choice[4]
                    print(link)
                    snippet=choice[5]
                    print(snippet)

                    return jsonify({"apiName":apiName,
                                    "title":title,
                                    "source":source,
                                    "link":link,
                                    "snippet":snippet
                                    }), 201
                elif choice[0]==2:
                    print("in model")
                    prediction=choice[1]
                    print(prediction)
                    confidence=choice[2]
                    print(confidence)
                    confidence_str=str(confidence)
                    new_history=History(checktype="Detected by Text",
                                    historydate=datetime.now(timezone.utc),
                                    articlehistorycontent=text,
                                    veracityresult=prediction,
                                    userid=user_id)
                    db.session.add(new_history)
                    db.session.commit()
                    return jsonify({'label': prediction, 'confidence':confidence_str }),200
                elif choice[0]==3:
                    return jsonify({'error': 'Language undetected'}), 205
        elif language=='ar':
                label, confidence = predict_Arabic_Text(text)
                print(label)
                print(confidence)
                confidence_str=str(confidence)
                new_history=History(checktype="Detected by Text",
                            historydate=datetime.now(timezone.utc),
                            articlehistorycontent=text,
                            veracityresult=label,
                            userid=user_id)
                db.session.add(new_history)
                db.session.commit()
                return jsonify({'label': label, 'confidence':confidence_str }),200    
        
@application.route("/api/OCRPredict", methods=['POST'])
def OCR_predict():

    user_id = session.get("user_id")
    
    if not user_id:
        
        if 'image' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        image =request.files['image']
        text=Image_extract_english(image)
        if isinstance(text, list):
            text = " ".join(text)  # Join list into a single string
        print(text)
        language = detect(text)
        if language == 'en':
            choice=Search_and_detect(text)
            if choice[0]==1:
                print("in web")
                apiName=choice[1]
                print(apiName)
                title=choice[2]
                print(title)
                source=choice[3]
                print(source)
                link=choice[4]
                print(link)
                snippet=choice[5]
                print(snippet)
                return jsonify({"apiName":apiName,
                                "title":title,
                                "source":source,
                                "link":link,
                                "snippet":snippet
                                }), 201
            elif choice[0]==2:
                print("in model")
                prediction=choice[1]
                print(prediction)
                confidence=choice[2]
                print(confidence)
                confidence_str=str(confidence)
                return jsonify({'label': prediction, 'confidence':confidence_str })
            elif choice[0]==3:
                return jsonify({'error': 'Language undetected'}), 205
        elif language=='ar':
            text_ar=Image_extract_arabic(image)
            label, confidence = predict_Arabic_Text(text_ar)
            print(label)
            print(confidence)
            confidence_str=str(confidence)
            return jsonify({'label': label, 'confidence':confidence_str }),200
        
    else:

        if 'image' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        image =request.files['image']
        text=Image_extract_english(image)
        if isinstance(text, list):
            text = " ".join(text)  # Join list into a single string
        print(text)
        language = detect(text)
        if language == 'en':
            choice=Search_and_detect(text)
            if choice[0]==1:
                print("in web")
                apiName=choice[1]
                print(apiName)
                title=choice[2]
                print(title)
                source=choice[3]
                print(source)
                link=choice[4]
                print(link)
                snippet=choice[5]
                print(snippet)
                return jsonify({"apiName":apiName,
                                "title":title,
                                "source":source,
                                "link":link,
                                "snippet":snippet
                                }), 201
            elif choice[0]==2:
                print("in model")
                prediction=choice[1]
                print(prediction)
                confidence=choice[2]
                print(confidence)
                confidence_str=str(confidence)
                new_history=History(checktype="Detected by Image",
                        historydate=datetime.now(timezone.utc),
                        articlehistorycontent=text,
                        veracityresult=prediction,
                        userid=user_id)
                db.session.add(new_history)
                db.session.commit()
                return jsonify({'label': prediction, 'confidence':confidence_str })
            elif choice[0]==3:
                return jsonify({'error': 'Language undetected'}), 205
        elif language=='ar':
            text_ar=Image_extract_arabic(image)
            label, confidence = predict_Arabic_Text(text_ar)
            print(label)
            print(confidence)
            confidence_str=str(confidence)
            new_history=History(checktype="Detected by Image",
                        historydate=datetime.now(timezone.utc),
                        articlehistorycontent=text_ar,
                        veracityresult=label,
                        userid=user_id)
            db.session.add(new_history)
            db.session.commit()
            return jsonify({'label': label, 'confidence':confidence_str }),200

@application.route("/api/logout",methods=["POST"])
def User_Logout():
     session.pop("user_id")
     return "200"
@application.route("/api/add_favorite", methods=['POST'])
def add_favorite():
    data = request.json
    user_id=session.get("user_id")
    articleid = data.get('articleid')

    if not user_id or not articleid:
        return jsonify({'error': 'Missing userid or articleid'}), 400

    favorite = Favorite(userid=user_id, articleid=articleid)
    db.session.add(favorite)
    db.session.commit()

    return jsonify({'message': 'Favorite added successfully'}),201
@application.route("/api/getfavbyid",methods=['GET'])
def get_favorite():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    # Retrieve all favorite records for the user
    all_favs = Favorite.query.filter_by(userid=user_id).order_by(desc(Favorite.favoriteid)).all()

    # Collect all articles associated with the favorite records
    favorite_articles = [Article.query.filter_by(articleid=fav.articleid).first() for fav in all_favs]

    # Convert articles to dictionaries
    articles_dict = [article.to_dict() for article in favorite_articles]

    return jsonify(articles_dict)
@application.route('/api/remove_favorite', methods=['DELETE'])
def remove_favorite():
    user_id = session.get("user_id")
    articleid = request.args.get('type')
    if not user_id or not articleid:
        return jsonify({'error': 'Missing userid or articleid'}), 400

    favorite = Favorite.query.filter_by(userid=user_id, articleid=articleid).first()
    if favorite:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({'message': 'Favorite removed successfully'}), 200
    else:
        return jsonify({'error': 'Favorite not found'}), 404
@application.route('/api/add_comment', methods=['POST'])
def add_comment():
    data = request.get_json()
    user_id = session.get("user_id")
    article_id = data.get('articleid')
    content = data.get('comment') 
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    if not article_id or not content:
        return jsonify({'error': 'Missing articleid or content'}), 400
    user=User.query.filter_by(userid=user_id).first()
    new_comment = Comment(userid=user_id, articleid=article_id, content=content,commentusername=user.username)
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({'message': 'Comment added successfully', 'comment': new_comment.to_dict()}), 201
@application.route('/api/getallcomments', methods=['GET'])
def get_comments():
    article_id=request.args.get('articleid')
    # Example endpoint to fetch comments for a specific article
    comments = Comment.query.filter_by(articleid=article_id).all()
    comments_dict = [comment.to_dict() for comment in comments]
    return jsonify(comments_dict), 200
@application.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('type')
    if query:
        articles = Article.query.filter(Article.articlecontent.ilike(f'%{query}%')).all()
        results = [article.to_dict() for article in articles]
        return jsonify(results)
    return jsonify([])
@application.route("/api/getHistById",methods=['GET'])
def get_history():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    # Retrieve all favorite records for the user
    # all_history = History.query.filter_by(userid=user_id).all()
    all_history = History.query.filter_by(userid=user_id).order_by(desc(History.historyid)).all()

    # Convert articles to dictionaries
    history_dict = [hist.to_dict() for hist in all_history]

    return jsonify(history_dict), 200
@application.route("/api/VideoPredict", methods=['POST'])
def Videopredict():
   user_id = session.get("user_id")
   if not user_id:
      return jsonify({'error': 'Unauthorized'}), 204
   
   if 'video' not in request.files:
      return jsonify({'error': 'No file part'}), 400
   file  =request.files['video']
   if file.filename == '':
     return jsonify({'error': 'No video selected for uploading'}), 400
   # Save the uploaded file to a temporary location
   # Save the uploaded file to a temporary location
   video_path = os.path.join('', file.filename)
   file.save(video_path)
    
    # Perform prediction using Vidpredict
   prediction = Vidpredict(video_path)
   confidencee=prediction[1]
   if prediction[0] == 1:
        print("REAL")
        label="REAL"
   else:
        print("FAKE")
        label="FAKE"
   return jsonify({'label': label,'confidence':confidencee })
@application.route("/api/ImagePredict", methods=['POST'])
def Imagepredict():
    user_id = session.get("user_id")
    if not user_id:
      return jsonify({'error': 'Unauthorized'}), 204

    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file  =request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected for uploading'}), 400
    # Read the image file directly into memory
    image_bytes = file.read()
    label,confidence = predict_image(image_bytes)
    confidence_str=str(confidence*100)
    print(label)
    return jsonify({'label': label,'confidence':confidence_str}),201
@application.route("/api")
def hello():
    return "Hello World!"
    user_id=session.get('user_id')

    if not user_id:
        return jsonify({'error': 'Unauthorized '}), 401


    #Retrieve a user by email:
    user= User.query.filter_by(userid=user_id).first()
    return jsonify({
        "id": user.userid,
        "email": user.email,
        "username":user.username
    })
def start_webscraping():
    #Run the webscraping script
    subprocess.Popen(['py', 'webscrap_ar.py'])
    subprocess.Popen(['py', 'webscrap_en.py'])
if __name__ == "__main__":
    start_webscraping()
    application.run(debug=True)