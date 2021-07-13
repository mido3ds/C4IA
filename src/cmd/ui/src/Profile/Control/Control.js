import './Control.css';
import React from 'react';

function Control({unit}) {
    return (
        <div className="control-container">
            <div data-augmented-ui="tr-clip br-clip bl-clip-y border" class="control-item"></div>
            <img className="attack-icon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMS45NzggNTExLjk3OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+PGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNzQuNzk1IDI4Ny4xODZjMTIuMDEyIDEyLjAyNiAxNi45MzQgMjkuNzUxIDEyLjgzMiA0Ni4yNi02LjMxMyAyNS40IDEuMjYgNTIuNjc2IDE5Ljc0NiA3MS4xNjJzNDUuNzMyIDI2LjAwMSA3MS4xNDcgMTkuNzQ2YzE2LjU4Mi00LjEzMSAzNC4yNjMuODIgNDYuMjc0IDEyLjgzMmwyMS4yMTEtMjEuMjExLTE1MC0xNTB6IiBmaWxsPSIjMTk5ZTlhIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggZD0ibTc2LjgwOSA0OTguODA1IDQ4LjcxNy00OC43MjZjLTE0LjY4NS01LjE5MS0yOC4zMS0xMy4yMDYtMzkuMzY0LTI0LjI2LTExLjE2Ni0xMS4xNi0xOS4yOS0yNC42NzItMjQuNDM1LTM5LjIwN2wtNDguNTY1IDQ4LjU3NGMtMTcuNTQ5IDE3LjU0OS0xNy41NDkgNDYuMDg0IDAgNjMuNjMzIDE3LjU0OCAxNy41NSA0Ni4wOTYgMTcuNTM3IDYzLjY0Ny0uMDE0eiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIGQ9Im0yOTYuMjg2IDMxLjAwNWg4NC44NTN2MjkuOTk3aC04NC44NTN6IiB0cmFuc2Zvcm09Im1hdHJpeCguNzA3IC0uNzA3IC43MDcgLjcwNyA2Ni42NzcgMjUyLjk4KSIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIGQ9Im0xNTguMjQ1IDMuNTc3aDI5Ljk5N3Y4NC44NTNoLTI5Ljk5N3oiIHRyYW5zZm9ybT0ibWF0cml4KC43MDcgLS43MDcgLjcwNyAuNzA3IDE4LjIxMyAxMzUuOTc2KSIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIGQ9Im0yNDAuOTc4LjAwM2gzMHY5MWgtMzB6IiBmaWxsPSIjMTk5ZTlhIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggZD0ibTI4Ny4xODMgNDM3LjE4NmMxMi4wMTItMTIuMDEyIDI5LjY5Mi0xNi45NjMgNDYuMjc0LTEyLjgzMiAyNS40MTUgNi4yNTUgNTIuNjYxLTEuMjYgNzEuMTQ3LTE5Ljc0NnMyNi4wNi00NS43NjIgMTkuNzQ2LTcxLjE2MmMtNC4xMDItMTYuNTA5LjgyLTM0LjIzMyAxMi44MzItNDYuMjZsLTIxLjIxMS0yMS4yMTEtMTUwIDE1MHoiIGZpbGw9IiMxOTllOWEiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCBkPSJtNDUwLjI1MSAzODYuNjEyYy01LjE0NSAxNC41MzUtMTMuMjcgMjguMDQ2LTI0LjQzNSAzOS4yMDctMTEuMDU0IDExLjA1NC0yNC42NzkgMTkuMDY5LTM5LjM2NCAyNC4yNmw0OC43MTcgNDguNzI2YzE3LjU1MSAxNy41NTEgNDYuMDk5IDE3LjU2MyA2My42NDcuMDE1IDE3LjU0OS0xNy41NDkgMTcuNTQ5LTQ2LjA4NCAwLTYzLjYzM3oiIGZpbGw9IiMxOTllOWEiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCBkPSJtMTkyLjM1NiAyMzQuNzgxIDQyLjQyMi00Mi40MjItMTYyLjM0OS0xNjIuMzU2Yy0xOS4wNzItMTkuMDcyLTQ1LjQ2OS0zMC03Mi40MjItMzAgMCAyNi45NTMgMTAuOTI4IDUzLjM1IDMwIDcyLjQyMnoiIGZpbGw9IiMxOTllOWEiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCBkPSJtMjc5LjA4NyAyOTMuOTk0aDU5Ljk5NHYzMC4xOTRoLTU5Ljk5NHoiIHRyYW5zZm9ybT0ibWF0cml4KC43MDcgLS43MDcgLjcwNyAuNzA3IC0xMjguMDMyIDMwOS4wODYpIiBmaWxsPSIjMTk5ZTlhIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggZD0ibTE3MS4wMDIgMjk4LjU1NyA0Mi40MjIgNDIuNDIyIDI2OC41NTQtMjY4LjU1NGMxOS4wNzItMTkuMDcyIDMwLTQ1LjQ2OSAzMC03Mi40MjItMjYuOTUzIDAtNTMuMzUgMTAuOTI4LTcyLjQyMiAzMHoiIGZpbGw9IiMxOTllOWEiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==" />
            <img className="defense-icon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQzMS45NDIgNDMxLjk0MiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNMzg1LjczMSwyNy41MWMwLjAzNS00LjQxOC0zLjUxOC04LjAyOC03LjkzNi04LjA2M2MtMS4xNTItMC4wMDktMi4yOTMsMC4yMzEtMy4zNDQsMC43MDMgICAgYy01MC4zODUsMjMuNDUtMTA5LjY5NCwxNi40MTktMTUzLjItMTguMTZjLTMuMDItMi42NTMtNy41NC0yLjY1My0xMC41NiwwYy00My42ODksMzQuMTM3LTEwMi43NDEsNDEuMTM3LTE1My4yLDE4LjE2ICAgIGMtNC4wMy0xLjgxMi04Ljc2NS0wLjAxMy0xMC41NzcsNC4wMTZjLTAuNDcyLDEuMDUxLTAuNzEyLDIuMTkxLTAuNzAzLDMuMzQ0YzAsMS42OCwwLjU2LDE2Ni42NCwwLDIyMS4yOCAgICBjLTAuMzIsMjkuMiw2Ny44NCwxMjQsMTY1LjY4LDE4Mi4wOGMyLjQ3NSwxLjQyOSw1LjUyNSwxLjQyOSw4LDBjOTgtNTguMDgsMTY2LjE2LTE1Mi44OCwxNjUuODQtMTgyLjA4ICAgIEMzODUuMTcxLDE5NC4xNSwzODUuNzMxLDI5LjE5LDM4NS43MzEsMjcuNTF6IE0zNjkuNzMxLDI0OC44N2MwLDE3LjYtNTYsMTA2LTE1My43NiwxNjUuNzYgICAgYy05OC4wOC01OS42OC0xNTMuOTItMTQ4LjA4LTE1My43Ni0xNjUuNjhjMC40OC00Ni4xNiwwLjE2LTE3MC40LDAtMjA5LjZjNTEuNjA3LDE4Ljg4NCwxMDkuMjIyLDEwLjkxLDE1My43Ni0yMS4yOCAgICBjNDQuNTM4LDMyLjE5LDEwMi4xNTMsNDAuMTY0LDE1My43NiwyMS4yOEMzNjkuNzMxLDc4LjQ3LDM2OS4zMzEsMjAyLjc5LDM2OS43MzEsMjQ4Ljg3eiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNMzQzLjk3MSw3Ni4xNWMwLjAzNS00LjQxOC0zLjUxOC04LjAyOC03LjkzNi04LjA2M2MtMS4xNTItMC4wMDktMi4yOTMsMC4yMzEtMy4zNDQsMC43MDMgICAgYy0zNi41NzEsMTcuMTkzLTc5LjcxOSwxMi4yMzctMTExLjQ0LTEyLjhjLTMuMDItMi42NTMtNy41NC0yLjY1My0xMC41NiwwYy0zMS43MjgsMjQuNzQ3LTc0LjU4MywyOS44MDMtMTExLjIsMTMuMTIgICAgYy00LjAzLTEuODEyLTguNzY1LTAuMDEzLTEwLjU3Nyw0LjAxNmMtMC40NzIsMS4wNTEtMC43MTIsMi4xOTItMC43MDMsMy4zNDRjMCwxLjIsMC40LDEyMy4zNiwwLDE2My44NCAgICBjLTAuMjQsMjIsNTAuNjQsOTMuMiwxMjMuNjgsMTM2LjU2aDBjMi40NzUsMS40MjksNS41MjUsMS40MjksOCwwYzczLjItNDMuMzYsMTI0LjA4LTExNC41NiwxMjQuMDgtMTM2Ljg4ICAgIEMzNDMuNTcxLDE5OS41MSwzNDMuOTcxLDc3LjQzLDM0My45NzEsNzYuMTV6IE0zMjcuOTcxLDIzOS45OWMwLDExLjI4LTQwLDc2LjMyLTExMiwxMjBjLTcxLjQ0LTQzLjkyLTExMi0xMDguOTYtMTEyLTEyMCAgICBjMC41Ni0zMi42NCwwLTEyMCwwLTE1MmMzNy43MDgsMTMuMjYyLDc5LjUxNCw3LjI5LDExMi0xNmMzMi40ODYsMjMuMjksNzQuMjkyLDI5LjI2MiwxMTIsMTZWMjM5Ljk5eiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" />
            <img className="escape-icon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ4Ny44MTEgNDg3LjgxIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiBjbGFzcz0iIj48Zz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnIGlkPSJfeDMzXzZfMjRfIj4KCQk8Zz4KCQkJPHBhdGggZD0iTTE1MC40NjMsMTA5LjUyMWgxNTAuNTEyYzMuOTU1LDAsNy4xNi0zLjIwNiw3LjE2LTcuMTYxYzAtMy45NTUtMy4yMDUtNy4xNjEtNy4xNi03LjE2MUgxNTAuNDYzICAgICBjLTMuOTU1LDAtNy4xNjEsMy4yMDYtNy4xNjEsNy4xNjFDMTQzLjMwMiwxMDYuMzE1LDE0Ni41MDgsMTA5LjUyMSwxNTAuNDYzLDEwOS41MjF6IiBmaWxsPSIjMTk5ZTlhIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+CgkJCTxwYXRoIGQ9Ik0xNS44NTMsMTc5LjUzN2gxNTAuNTExYzMuOTU1LDAsNy4xNjEtMy4yMDYsNy4xNjEtNy4xNjFzLTMuMjA2LTcuMTYtNy4xNjEtNy4xNkgxNS44NTMgICAgIGMtMy45NTUsMC03LjE2MSwzLjIwNS03LjE2MSw3LjE2UzExLjg5OCwxNzkuNTM3LDE1Ljg1MywxNzkuNTM3eiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCQk8cGF0aCBkPSJNNTYuMjU4LDI1My4yMTRjMCwzLjk1NSwzLjIwNiw3LjE2Miw3LjE2MSw3LjE2MkgyMTMuOTNjMy45NTUsMCw3LjE2MS0zLjIwNyw3LjE2MS03LjE2MnMtMy4yMDYtNy4xNi03LjE2MS03LjE2SDYzLjQxOSAgICAgQzU5LjQ2NCwyNDYuMDU0LDU2LjI1OCwyNDkuMjU5LDU2LjI1OCwyNTMuMjE0eiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCQk8cGF0aCBkPSJNMTQyLjM5NiwzMzYuNDRINy4xNjFDMy4yMDYsMzM2LjQ0LDAsMzM5LjY0NSwwLDM0My42czMuMjA2LDcuMTYxLDcuMTYxLDcuMTYxaDEzNS4yMzVjMy45NTUsMCw3LjE2MS0zLjIwNiw3LjE2MS03LjE2MSAgICAgUzE0Ni4zNTEsMzM2LjQ0LDE0Mi4zOTYsMzM2LjQ0eiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCQk8cGF0aCBkPSJNMzg1LjcyOSwxNTQuNDE4YzIxLjYsMCwzOS4xMTEtMTcuNTEzLDM5LjExMS0zOS4xMTRzLTE3LjUxMi0zOS4xMTMtMzkuMTExLTM5LjExMyAgICAgYy0yMS42MDUsMC0zOS4xMTksMTcuNTEzLTM5LjExOSwzOS4xMTNDMzQ2LjYwOSwxMzYuOTA1LDM2NC4xMjMsMTU0LjQxOCwzODUuNzI5LDE1NC40MTh6IiBmaWxsPSIjMTk5ZTlhIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+CgkJCTxwYXRoIGQ9Ik00NTAuMDY2LDE0My4xNTVjLTIyLjQ1OSwzMS40NTktNTIuNTMzLDM1LjEwMi04NC44OTUsMTUuODljLTIuMjAzLTEuMzA2LTExLjk3Ny02LjY5MS0xNC4xNDEtNy45NzcgICAgIGMtNTIuMDYxLTMwLjkwNi0xMDQuMDYxLTE4Ljc4Ni0xMzguOTM0LDMwLjA1Yy0xNC44MTksMjAuNzcxLDE5LjQ1NSw0MC40NTksMzQuMTA4LDE5LjkzICAgICBjMTguMDE4LTI1LjIzMiw0MC45MjktMzIuNTMzLDY1Ljk4Ni0yNC41NDFjLTEyLjgzLDIyLjI3LTI0LjA0Nyw0NC40MDUtMzkuODc1LDc1Ljg1MyAgICAgYy0xNS44MzIsMzEuNDQ4LTUwLjc4Nyw1Ni41NjItODQuMzc0LDM2LjkyYy0yNC4yMzUtMTQuMTY1LTQ2LjA5LDIwLjY1MS0yMS45MjgsMzQuNzcyICAgICBjNDUuODU0LDI2Ljc5OSw5OS42MTksMTAuMzQzLDEyNy4wNjYtMjQuNDkzYzAuOTUyLDAuNTA5LDEuOTU4LDAuOTY4LDMuMDYyLDEuMzU0YzIyLjQyMiw3LjgxMiw1MS44MTQsMjguNjEsNjAuNzcsMzUuOTgxICAgICBjOC45NTMsNy4zNzEsMjQuMzM2LDQ0LjkyMSwzMy40NzEsNjMuNzg4YzExLjA4MiwyMi44OTMsNDYuODcxLDYuMjE5LDM1Ljc0OC0xNi43NzFjLTEwLjM1NS0yMS40MDYtMjcuNzM2LTY0LjEyOS00MS4yOTMtNzQuOTM4ICAgICBjLTEwLjg3NS04LjY2OS0zMS45ODgtMjQuODAzLTQ5Ljg5NS0zMy45NTZjMTIuMTE1LTIzLjQ2NiwyNC43MjktNDYuNjc5LDM4LjAwOC02OS40OTEgICAgIGM0Mi4zMjgsMTIuOTY5LDgyLjU2MS0yLjMwOCwxMTEuMjE1LTQyLjQ0NkM0OTguOTk2LDE0Mi4zMTIsNDY0LjczLDEyMi42MjQsNDUwLjA2NiwxNDMuMTU1eiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCTwvZz4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+" />
            <img className="video-icon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMi4wMDIgNTEyLjAwMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNNDYyLjAwMiw5Mi4wMDJoLTQyLjAwMVY1MGMwLTI3LjU3LTIyLjQzLTUwLTUwLTUwaC0zMjBjLTI3LjU3LDAtNTAsMjIuNDMtNTAsNTB2MzIwYzAsMjcuNTcsMjIuNDMsNTAsNTAsNTBoNDIuMDAxICAgIHY0Mi4wMDJjMCwyNy41NywyMi40Myw1MCw1MCw1MGgzMjBjMjcuNTcsMCw1MC0yMi40Myw1MC01MFYxNDIuMDAxQzUxMi4wMDMsMTE0LjQzMSw0ODkuNTczLDkyLjAwMiw0NjIuMDAyLDkyLjAwMnogTTUwLjAwMSw0MDAgICAgYy0xNi41NDIsMC0zMC0xMy40NTctMzAtMzBWNTBjMC0xNi41NDIsMTMuNDU4LTMwLDMwLTMwaDMyMGMxNi41NDIsMCwzMCwxMy40NTgsMzAsMzB2MzIwYzAsMTYuNTQyLTEzLjQ1OCwzMC0zMCwzMEg1MC4wMDF6ICAgICBNNDkyLjAwMiw0NjIuMDAyYzAsMTYuNTQyLTEzLjQ1OCwzMC0zMCwzMGgtMzIwYy0xNi41NDIsMC0zMC0xMy40NTgtMzAtMzBWNDIwaDI1Ny45OTljMjcuNTcsMCw1MC0yMi40Myw1MC01MFYxMTIuMDAyaDQyLjAwMSAgICBjMTYuNTQyLDAsMzAsMTMuNDU4LDMwLDMwVjQ2Mi4wMDJ6IiBmaWxsPSIjMTk5ZTlhIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik0xNDIuMjUsNDU3LjAwMmgtMC4yN2MtNS41MjMsMC0xMCw0LjQ3Ny0xMCwxMHM0LjQ3NywxMCwxMCwxMGgwLjI3YzUuNTIzLDAsMTAtNC40NzcsMTAtMTAgICAgUzE0Ny43NzQsNDU3LjAwMiwxNDIuMjUsNDU3LjAwMnoiIGZpbGw9IiMxOTllOWEiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiPjwvcGF0aD4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTQ2Mi4wMjUsNDU3LjAwMkgxNzAuOThjLTUuNTIzLDAtMTAsNC40NzctMTAsMTBzNC40NzcsMTAsMTAsMTBoMjkxLjA0NGM1LjUyMiwwLDEwLTQuNDc3LDEwLTEwICAgIFM0NjcuNTQ3LDQ1Ny4wMDIsNDYyLjAyNSw0NTcuMDAyeiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNMTEwLjAzNSwzNWgtMC4yN2MtNS41MjMsMC0xMCw0LjQ3Ny0xMCwxMHM0LjQ3NywxMCwxMCwxMGgwLjI3YzUuNTIzLDAsMTAtNC40NzcsMTAtMTBTMTE1LjU1OSwzNSwxMTAuMDM1LDM1eiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNODEuMDM2LDM1SDUwLjAwMWMtNS41MjMsMC0xMCw0LjQ3Ny0xMCwxMHM0LjQ3NywxMCwxMCwxMGgzMS4wMzRjNS41MjMsMCwxMC00LjQ3NywxMC0xMCAgICBDOTEuMDM2LDM5LjQ3Nyw4Ni41NTksMzUsODEuMDM2LDM1eiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNMjkzLjQ4NSwyMDEuMTI5Yy0yLjM3Ny04Ljc5OS04LjAzNy0xNi4xNDYtMTUuOTIyLTIwLjY3NmwtNDguOTE4LTI4LjI0MmMtMC40OTEtMC4zMTktMC45ODYtMC42MjUtMS40ODQtMC45MTEgICAgbC00OC43OTItMjguMTcyYy01LjU4OS0zLjY4NS0xMi4wODYtNS42MzEtMTguODEzLTUuNjMxYy0xOC44NzEsMC0zNC4yMjQsMTUuMzUyLTM0LjIyNCwzNC4yMjR2MTE2LjYxMSAgICBjMCwwLjQwNywwLjAyNSwwLjgwOSwwLjA3MiwxLjIwM2MwLjE5Nyw1LjU4LDEuNzcyLDExLjA2LDQuNTg2LDE1LjkyYzYuMDksMTAuNTE2LDE3LjQyOCwxNy4wNDgsMjkuNTksMTcuMDQ4ICAgIGM1Ljk4NiwwLDExLjktMS41OTIsMTcuMDg5LTQuNTk4bDUwLjQ5Mi0yOS4xNTNjMC4yODYtMC4xNjYsMC41NjEtMC4zNDMsMC44MjUtMC41MzJsNDkuMjE5LTI4LjQxNCAgICBjNS4zNzMtMy4wMDEsOS44NC03LjQxNywxMi45MjMtMTIuNzc5QzI5NC42NjksMjE5LjEyNSwyOTUuODYxLDIwOS45MjcsMjkzLjQ4NSwyMDEuMTI5eiBNMjcyLjc5LDIxNy4wNjEgICAgYy0xLjI4NCwyLjIzMy0zLjE0MSw0LjA2Ny01LjM2OSw1LjMwNGMtMC4wNDksMC4wMjctMC4wOTksMC4wNTUtMC4xNDgsMC4wODNMMjE3LjE0LDI1MS4zOWMtMC4yODcsMC4xNjUtMC41NjIsMC4zNDMtMC44MjYsMC41MzIgICAgbC00OS42NTYsMjguNjdjLTIuMTU5LDEuMjUtNC42MDcsMS45MTItNy4wNzgsMS45MTJjLTUuMDUsMC05Ljc1Ny0yLjcwOS0xMi4yODMtNy4wNzFjLTEuMjUzLTIuMTY0LTEuOTE0LTQuNjE2LTEuOTEyLTcuMDkxICAgIGMwLTAuMzQtMC4wMTctMC42NzktMC4wNTItMS4wMTVWMTUxLjcyMWgwLjAwMWMwLTcuODQzLDYuMzgxLTE0LjIyNCwxNC4yMjQtMTQuMjI0YzIuODUxLDAsNS41OTUsMC44MzYsNy45MzYsMi40MTcgICAgYzAuMTk1LDAuMTMxLDAuMzk0LDAuMjU2LDAuNTk3LDAuMzc0bDQ5LjA5MSwyOC4zNDRjMC4yNDYsMC4xNDIsMC40ODIsMC4yOTIsMC43MTYsMC40NDdjMC4xNjYsMC4xMDksMC4zMzUsMC4yMTQsMC41MDcsMC4zMTQgICAgbDQ5LjE3NywyOC4zOTFjMy4yNywxLjg3OSw1LjYxMiw0LjkxOSw2LjU5Niw4LjU2MUMyNzUuMTYxLDIwOS45ODcsMjc0LjY2OCwyMTMuNzkzLDI3Mi43OSwyMTcuMDYxeiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" />
            <svg className="ctrl-svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 1000 1000" styles="enable-background:new 0 0 1000 1000;" space="preserve">
                <circle class="st0" cx="500" cy="500" r="302.8">
                    <animateTransform attributeType="xml"
                        attributeName="transform"
                        type="rotate"
                        from="0 500 500"
                        to="360 500 500"
                        dur="100s"
                        repeatCount="indefinite" />
                </circle>
                <circle class="st1" cx="500" cy="500" r="237.7">
                    <animateTransform attributeType="xml"
                        attributeName="transform"
                        type="rotate"
                        from="0 500 500"
                        to="360 500 500"
                        dur="40s"
                        repeatCount="indefinite" />
                </circle>
                <circle class="st2" cx="500" cy="500" r="366.8" transform="rotate(0 500 500)">
                    <animateTransform attributeType="xml"
                        attributeName="transform"
                        type="rotate"
                        from="0 500 500"
                        to="-360 500 500"
                        dur="50s"
                        repeatCount="indefinite" />
                </circle>
                <circle class="st3" cx="500" cy="500" r="385.1" />
            </svg>
        </div>
    );
}
export default Control;
