# Part 0 Exercises

## Exercise 0.4: New note diagram

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note over browser: User writes a note and clicks the Save button

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note over server: Server saves the new note to its array/database
    server-->>browser: HTTP 302 Redirect to /exampleapp/notes
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "nock nock", "date": "2026-24-6" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```

## Exercise 0.5: Single page app diagram

```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "nock nock", "date": "2026-24-6" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```

## Exercise 0.6: New note in Single page app diagram

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note over browser: The user fills out the form and clicks "Save"
    Note over browser: The client-side JavaScript intercepts the form submit event
    Note over browser: JS code pushes the new note locally to the notes array and redraws the UI list

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note over server: Server extracts JSON body and appends it to the notes array
    server-->>browser: HTTP 201 Created (JSON confirmation: {"message":"note created"})
    deactivate server
    
    Note over browser: The page does not reload
```