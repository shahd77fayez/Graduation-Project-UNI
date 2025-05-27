from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from sqlalchemy import Sequence
from datetime import datetime,timezone


db =SQLAlchemy()
def get_uuid():
    return uuid4().hex



# Define your models corresponding to your existing tables
class User(db.Model):
    __tablename__ = 'users'  # Use the existing table name
    userid = db.Column(db.String(255),nullable=False, primary_key=True, unique=True,default=get_uuid)
    username = db.Column(db.String(255))
    password = db.Column(db.String(255))
    email = db.Column(db.String(255))
    age=db.Column(db.Integer)
    bio=db.Column(db.String(500))
class Article(db.Model):
    __tablename__ = 'article'
    articleid = db.Column(db.BigInteger, Sequence('article_articleid_seq'), primary_key=True, autoincrement=True)
    articlecontent = db.Column(db.String(500), nullable=False)
    articletype = db.Column(db.String(50), nullable=False)
    articledate = db.Column(db.Date, nullable=False, default=datetime.now(timezone.utc))
    articlelang = db.Column(db.String(20), nullable=False)
    def to_dict(self):
        return {
            'articleid': self.articleid,
            'articlecontent': self.articlecontent,
            'articletype': self.articletype,
            'articledate': self.articledate.strftime('%Y-%m-%d'),
            'articlelang': self.articlelang
        }
class Favorite(db.Model):
    _tablename_ = 'favorite'
    favoriteid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userid = db.Column(db.String(255), db.ForeignKey('users.userid'), nullable=False)
    articleid = db.Column(db.BigInteger, db.ForeignKey('article.articleid'), nullable=False)
    user = db.relationship('User', backref=db.backref('favorites', lazy=True))
    article = db.relationship('Article', backref=db.backref('favorites',lazy=True))
class Comment(db.Model):
    __tablename__ = 'articlecomment'  # Corrected __tablename__
    commentid = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    userid = db.Column(db.String(255), db.ForeignKey('users.userid'), nullable=False)
    articleid = db.Column(db.BigInteger, db.ForeignKey('article.articleid'), nullable=False)
    content = db.Column(db.String(250), nullable=False)
    commentdate = db.Column(db.Date, nullable=False, default=datetime.now(timezone.utc))
    commentusername = db.Column(db.String(100), nullable=False)
    user = db.relationship('User', backref=db.backref('articlecomment', lazy=True))
    article = db.relationship('Article', backref=db.backref('articlecomment', lazy=True))

    def to_dict(self):
        return {
            'commentid': self.commentid,
            'userid': self.userid,
            'articleid': self.articleid,
            'content': self.content,
            'commentdate': self.commentdate.strftime('%Y-%m-%d'),
            'commentusername':self.commentusername
        }
class History(db.Model):
    _tablename_ = 'history'
    userid = db.Column(db.String(255), db.ForeignKey('users.userid'), nullable=False)
    historydate = db.Column(db.Date, nullable=False, default=datetime.now(timezone.utc))
    articlehistorycontent = db.Column(db.String(1000), nullable=False)
    checktype=db.Column(db.String(100), nullable=False)
    veracityresult=db.Column(db.String(100), nullable=False)
    historyid = db.Column(db.BigInteger, primary_key=True, autoincrement=True) 
    user = db.relationship('User', backref=db.backref('history', lazy=True))
    def to_dict(self):
        return {
            'userid': self.userid,
            'historydate': self.historydate.strftime('%Y-%m-%d'),
            'articlehistorycontent': self.articlehistorycontent,
            'checktype': self.checktype,
            'veracityresult': self.veracityresult,
            'historyid': self.historyid
        }
