---
title: "IA-refactor"
dateCreated: "2024-01-15"
dateModified: "2024-03-13"
---
# IA

## 목적

- youtube의 재생목록을 강의처럼 수강 할 수 있는 웹앱

## IA

### Client

#### /

- /
  - view
    - header
      - url search
    - main
      - recent created
    - footer
      - about
      - privacy
      - coatact
      - cookies

#### /users

- /users/signup
  - view
    - email
    - password
    - password confirm
    - sign up
- /users/signin
  - view
    - email
    - password
    - sign in
- /users/find-password
  - view
    - email
- /users/:id
  - view
    - tab
      - profile
      - enrolls
- /users/enrolls
  - query

#### /courses

- /courses
  - view
    - tab
      - category
    - query
      - category
      - order
        - recent
        - popular
- /courses/:courseId
  - view
    - not found
      - view
        - create
    - find
      - header
        - title
        - enrolls
        - youtube link
        - channel name
      - main
        - description
        - sections
      - side
        - enroll / watch

#### /channels

- /channels/:channelId/courses
  - view
    - header
      - channel name
      - youtube link
    - videos
      - query
        - recent
        - popular

#### /watch

- /watch/courses/:coursesId
  - view
    - header
      - title
    - sidebar
      - chapter and progress
    - footer
      - prev, next, settings, complete btn

#### /admin

- /admin/dashboard
  - view
    - tab
      - users
      - courses
      - channels
      - categorys
      - roles
    - dashboard
      - users
        - MAU
        - total user
      - total channels
      - total courses
- /admin/users
  - view
    - tab
      - /statics
        - total
        - mau
        - dau
        - cumulative month, day
      - /list
        - id
        - role
        - order
          - recent
        - edit
- /admin/users/:id
  - view
    - edit
- /admin/courses
  - view
    - tab
      - /statics
        - total
        - cumulative month, day
        - by category
      - /list
        - query
          - id
          - title
          - category
          - channelId
          - createdAt
          - ganerated_ai
          - edit
- /admin/courses/:id
  - view
    - edit
- /admin/channels
  - view
    - tab
      - /statics
        - total
        - cumulative month, day
      - /list
        - query
          - channelId
          - createdAt
- /admin/categorys
  - view
    - tab
      - /list
        - edit, create, delete
        - query
          - name
- /admin/roles
  - view
    - tab
      - /list
        - create, edit, delete
