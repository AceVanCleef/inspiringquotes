from typing import List, Optional
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base # Das ist die Base mit (DeclarativeBase), die wir gerade besprochen haben

class Author(Base):
    __tablename__ = "authors"

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    bio: Mapped[Optional[str]] = mapped_column(String(500))
    
    # An author can have multiple links
    links: Mapped[List["AuthorLink"]] = relationship(back_populates="author")
    
    # The relationship to the quotes
    quotes: Mapped[List["Quote"]] = relationship(back_populates="author")

class AuthorLink(Base):
    __tablename__ = "author_links"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    url: Mapped[str] = mapped_column(String(255))
    label: Mapped[Optional[str]] = mapped_column(String(50))
    
    link_type_id: Mapped[int] = mapped_column(ForeignKey("link_types.id"))
    link_type: Mapped["LinkType"] = relationship(back_populates="links")
    
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id"))
    author: Mapped["Author"] = relationship(back_populates="links")

class LinkType(Base):
    __tablename__ = "link_types"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)  # "Instagram", "Website", etc.
    
    # Back-reference zu den Links
    links: Mapped[List["AuthorLink"]] = relationship(back_populates="link_type")

class Quote(Base):
    __tablename__ = "quotes"

    id: Mapped[int] = mapped_column(primary_key=True)
    text: Mapped[str] = mapped_column(String(500))
    likes = Column(Integer, default=0)
    
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id"))
    author: Mapped["Author"] = relationship(back_populates="quotes")