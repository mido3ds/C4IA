import React, { useEffect, useRef, useState } from 'react';
import RecordAudio from '../RecordAudio/RecordAudio'
import GetRadius from '../GetRadius/GetRadius';
import { postAudioMsg } from '../Api/Api'
import { NotificationManager } from 'react-notifications';
import { getGroups } from '../Api/Api'
import { groupIDs } from '../groupIDs'
import './GroupSelect.css';

const IDs = ["pink", "orange", "blue", "yellow", "green"]
const srcImages = ["data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik0yNTYsMHY1MTJjMTQxLjM4NSwwLDI1Ni0xMTQuNjE1LDI1Ni0yNTZTMzk3LjM4NSwwLDI1NiwweiIgZmlsbD0iIzlkMTE5NSIgZGF0YS1vcmlnaW5hbD0iIzkwMWMwZiIgY2xhc3M9IiI+PC9wYXRoPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik00NzAuNzkzLDI1NkM0NzAuNzkzLDExNC42MTUsMzc0LjYyNiwwLDI1NiwwQzExNC42MTUsMCwwLDExNC42MTUsMCwyNTZzMTE0LjYxNSwyNTYsMjU2LDI1NiAgQzM3NC42MjYsNTEyLDQ3MC43OTMsMzk3LjM4NSw0NzAuNzkzLDI1NnoiIGZpbGw9IiNlMDBkYjUiIGRhdGEtb3JpZ2luYWw9IiNlMDIzMGQiIGNsYXNzPSIiPjwvcGF0aD4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPg==",
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik0yNTYsMHY1MTJjMTQxLjM4NSwwLDI1Ni0xMTQuNjE1LDI1Ni0yNTZTMzk3LjM4NSwwLDI1NiwweiIgZmlsbD0iIzkxNGQwNSIgZGF0YS1vcmlnaW5hbD0iIzkwMWMwZiIgY2xhc3M9IiI+PC9wYXRoPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik00NzAuNzkzLDI1NkM0NzAuNzkzLDExNC42MTUsMzc0LjYyNiwwLDI1NiwwQzExNC42MTUsMCwwLDExNC42MTUsMCwyNTZzMTE0LjYxNSwyNTYsMjU2LDI1NiAgQzM3NC42MjYsNTEyLDQ3MC43OTMsMzk3LjM4NSw0NzAuNzkzLDI1NnoiIGZpbGw9IiNlMDg0MGQiIGRhdGEtb3JpZ2luYWw9IiNlMDIzMGQiIGNsYXNzPSIiPjwvcGF0aD4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPg==",
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik0yNTYsMHY1MTJjMTQxLjM4NSwwLDI1Ni0xMTQuNjE1LDI1Ni0yNTZTMzk3LjM4NSwwLDI1NiwweiIgZmlsbD0iIzBlNDI3MCIgZGF0YS1vcmlnaW5hbD0iIzkwMWMwZiIgY2xhc3M9IiI+PC9wYXRoPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik00NzAuNzkzLDI1NkM0NzAuNzkzLDExNC42MTUsMzc0LjYyNiwwLDI1NiwwQzExNC42MTUsMCwwLDExNC42MTUsMCwyNTZzMTE0LjYxNSwyNTYsMjU2LDI1NiAgQzM3NC42MjYsNTEyLDQ3MC43OTMsMzk3LjM4NSw0NzAuNzkzLDI1NnoiIGZpbGw9IiMwZDQyZTAiIGRhdGEtb3JpZ2luYWw9IiNlMDIzMGQiIGNsYXNzPSIiPjwvcGF0aD4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPg==",
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik0yNTYsMHY1MTJjMTQxLjM4NSwwLDI1Ni0xMTQuNjE1LDI1Ni0yNTZTMzk3LjM4NSwwLDI1NiwweiIgZmlsbD0iIzcwNmEwZSIgZGF0YS1vcmlnaW5hbD0iIzkwMWMwZiIgY2xhc3M9IiI+PC9wYXRoPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik00NzAuNzkzLDI1NkM0NzAuNzkzLDExNC42MTUsMzc0LjYyNiwwLDI1NiwwQzExNC42MTUsMCwwLDExNC42MTUsMCwyNTZzMTE0LjYxNSwyNTYsMjU2LDI1NiAgQzM3NC42MjYsNTEyLDQ3MC43OTMsMzk3LjM4NSw0NzAuNzkzLDI1NnoiIGZpbGw9IiNlMGQzMGQiIGRhdGEtb3JpZ2luYWw9IiNlMDIzMGQiIGNsYXNzPSIiPjwvcGF0aD4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPg==",
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik0yNTYsMHY1MTJjMTQxLjM4NSwwLDI1Ni0xMTQuNjE1LDI1Ni0yNTZTMzk3LjM4NSwwLDI1NiwweiIgZmlsbD0iIzExNzAwZSIgZGF0YS1vcmlnaW5hbD0iIzkwMWMwZiIgY2xhc3M9IiI+PC9wYXRoPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik00NzAuNzkzLDI1NkM0NzAuNzkzLDExNC42MTUsMzc0LjYyNiwwLDI1NiwwQzExNC42MTUsMCwwLDExNC42MTUsMCwyNTZzMTE0LjYxNSwyNTYsMjU2LDI1NiAgQzM3NC42MjYsNTEyLDQ3MC43OTMsMzk3LjM4NSw0NzAuNzkzLDI1NnoiIGZpbGw9IiM2ZGUwMGQiIGRhdGEtb3JpZ2luYWw9IiNlMDIzMGQiIGNsYXNzPSIiPjwvcGF0aD4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPg=="]

function GroupSelect({port}) {
    const recordAudioRef = useRef(null);
    const getRadiusRef = useRef(null);

    const [chosenGroup, setChosenGroup] = useState(null)
    const [groups, setGroups] = useState([])

    useEffect(() => {
        if(groups.length !== 0 || !port) return
        getGroups(port).then(data => {
            setGroups(data)
            var items = document.querySelectorAll('.circle img');
            for (var i = 0, l = items.length; i < l; i++) {
                items[i].style.left = (50 - 30 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
                items[i].style.top = (50 + 30 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
            }
        })
    }, [port])

    var handleButton = (e) => {
        e.preventDefault();
        document.querySelector('.circle').classList.toggle('open');
    }

    var onGetRadius = (radius) => {
        setChosenGroup(group => {
            group.ip = "255.255." + (radius >> 8).toString(10) + "." + (radius & 0xff).toString(10)
            console.log(group.ip)
            return group
        })
        recordAudioRef.current.openModal();
    }

    var onGroupIconClick = (group) => {
        setChosenGroup(group)

        if(group.id === "broadcast") {
            getRadiusRef.current.open();
        } else {
            recordAudioRef.current.openModal();
        }
    }

    var onSendAudio = (audio) => {
        var notificationMsg = chosenGroup.id === "broadcast" ? "Your audio message will be sent to all units." :
            "Your audio message will be sent to the " + chosenGroup.id + " group."
        NotificationManager.info(notificationMsg)
        postAudioMsg(chosenGroup.ip, audio, port)
    }

    return (
        <>
            <RecordAudio onSend={onSendAudio} ref={recordAudioRef}></RecordAudio>
            <GetRadius onGetRadius={onGetRadius} ref={getRadiusRef}> </GetRadius>
            {groups ? <nav class="circular-menu">
                <div class="circle">
                    {groups.map((group, index) => {
                        return <img alt={IDs[index]} key={index} onClick={() => onGroupIconClick({ ip: group, id: IDs[groupIDs[group]] })} id={IDs[index]} src={srcImages[index]} />
                    })}
                    <img alt="broadcast" onClick={() => onGroupIconClick({ ip: "0.0.0.0", id: "broadcast" })} id="broadcast" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSI2My4yIiBmaWxsPSIjMDQwMDAwIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT48cGF0aCBkPSJtMTQxLjY5NSAxNDEuNjk1LTIxLjIxMy0yMS4yMTNjLTM2LjI1MSAzNi4yNTEtNTYuMjE1IDg0LjM3OS01Ni4yMTUgMTM1LjUxOHMxOS45NjQgOTkuMjY3IDU2LjIxNiAxMzUuNTE4bDIxLjIxMy0yMS4yMTNjLTMwLjU4Ni0zMC41ODUtNDcuNDI5LTcxLjE4LTQ3LjQyOS0xMTQuMzA1czE2Ljg0My04My43MiA0Ny40MjgtMTE0LjMwNXoiIGZpbGw9IiMwNDAwMDAiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCBkPSJtOTYuMjczIDk2LjI3My0yMS4yMTItMjEuMjEyYy00OC40MDQgNDguNDAzLTc1LjA2MSAxMTIuNjYyLTc1LjA2MSAxODAuOTM5czI2LjY1NyAxMzIuNTM2IDc1LjA2MSAxODAuOTM5bDIxLjIxMy0yMS4yMTNjLTQyLjczNy00Mi43MzctNjYuMjc0LTk5LjQ2Mi02Ni4yNzQtMTU5LjcyNnMyMy41MzctMTE2Ljk4OSA2Ni4yNzMtMTU5LjcyN3oiIGZpbGw9IiMwNDAwMDAiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCBkPSJtNDM2LjkzOSA3NS4wNjEtMjEuMjEzIDIxLjIxM2M0Mi43MzcgNDIuNzM3IDY2LjI3NCA5OS40NjIgNjYuMjc0IDE1OS43MjZzLTIzLjUzNyAxMTYuOTg5LTY2LjI3MyAxNTkuNzI3bDIxLjIxMyAyMS4yMTNjNDguNDAzLTQ4LjQwNCA3NS4wNi0xMTIuNjYzIDc1LjA2LTE4MC45NHMtMjYuNjU3LTEzMi41MzYtNzUuMDYxLTE4MC45Mzl6IiBmaWxsPSIjMDQwMDAwIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggZD0ibTM5MS41MTggMTIwLjQ4Mi0yMS4yMTMgMjEuMjEzYzMwLjU4NSAzMC41ODUgNDcuNDI4IDcxLjE4IDQ3LjQyOCAxMTQuMzA1cy0xNi44NDQgODMuNzItNDcuNDI5IDExNC4zMDVsMjEuMjEzIDIxLjIxM2MzNi4yNTEtMzYuMjUxIDU2LjIxNi04NC4zNzkgNTYuMjE2LTEzNS41MThzLTE5Ljk2NC05OS4yNjctNTYuMjE1LTEzNS41MTh6IiBmaWxsPSIjMDQwMDAwIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggZD0ibTM0Ni4wOTUgMTY1LjkwNS0yMS4yMTMgMjEuMjEzYzE4LjQzMyAxOC40MzMgMjguNTg0IDQyLjg5NiAyOC41ODQgNjguODgycy0xMC4xNTEgNTAuNDQ5LTI4LjU4NCA2OC44ODJsMjEuMjEzIDIxLjIxM2MyNC4xLTI0LjA5OSAzNy4zNzItNTYuMDk2IDM3LjM3Mi05MC4wOTVzLTEzLjI3Mi02NS45OTYtMzcuMzcyLTkwLjA5NXoiIGZpbGw9IiMwNDAwMDAiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCBkPSJtMTY1LjkwNSAxNjUuOTA1Yy0yNC4xIDI0LjA5OS0zNy4zNzIgNTYuMDk1LTM3LjM3MiA5MC4wOTVzMTMuMjcyIDY1Ljk5NiAzNy4zNzIgOTAuMDk1bDIxLjIxMy0yMS4yMTNjLTE4LjQzMy0xOC40MzMtMjguNTg0LTQyLjg5Ni0yOC41ODQtNjguODgyczEwLjE1MS01MC40NDkgMjguNTg0LTY4Ljg4MnoiIGZpbGw9IiMwNDAwMDAiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==" />
                </div>
                <img alt="record-audio" onClick={handleButton} class="menu-button" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDM4OS4xMiAzODkuMTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTIxNS4wNzIsMGgtNDEuMDI3Yy0zMC4wOTIsMC01NC41NzksMjQuNTE2LTU0LjU3OSw1NC42NTN2MTM2LjQ5NGMwLDMuNzcsMy4wNTMsNi44MjcsNi44MjcsNi44MjdoMTM2LjUzMyAgICBjMy43NzMsMCw2LjgyNy0zLjA1Nyw2LjgyNy02LjgyN1Y1NC42NTNDMjY5LjY1MywyNC41MTYsMjQ1LjE2NiwwLDIxNS4wNzIsMHogTTI1NiwxODQuMzJIMTMzLjEyVjU0LjY1MyAgICBjMC0yMi42MDcsMTguMzYtNDAuOTk5LDQwLjkyNi00MC45OTloNDEuMDI4QzIzNy42NCwxMy42NTMsMjU2LDMyLjA0NiwyNTYsNTQuNjUzVjE4NC4zMnoiIGZpbGw9IiMxOTllOWEiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiPjwvcGF0aD4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTExOS40NjcsMTg0LjMydjQ0LjM3M2MwLDI0LjQ2NywxOC4zNTksNDQuMzczLDQwLjkyNiw0NC4zNzNoNjguMzM1YzIyLjU2NiwwLDQwLjkyNi0xOS45MDcsNDAuOTI2LTQ0LjM3M1YxODQuMzIgICAgSDExOS40Njd6IE0yNTUuOTk4LDIyOC42OTNjMCwxNi45NC0xMi4yMzMsMzAuNzItMjcuMjczLDMwLjcyaC02OC4zMzNjLTE1LjAzOSwwLTI3LjI3My0xMy43OC0yNy4yNzMtMzAuNzJ2LTMwLjcyaDEyMi44NzggICAgVjIyOC42OTN6IiBmaWxsPSIjMTk5ZTlhIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik0xNjcuMjUzLDYxLjQ0SDEzMy4xMmMtMy43NzMsMC02LjgyNywzLjA1Ny02LjgyNyw2LjgyN3MzLjA1Myw2LjgyNyw2LjgyNyw2LjgyN2gzNC4xMzNjMy43NzMsMCw2LjgyNy0zLjA1Nyw2LjgyNy02LjgyNyAgICBTMTcxLjAyNyw2MS40NCwxNjcuMjUzLDYxLjQ0eiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNMTY3LjI1Myw4OC43NDdIMTMzLjEyYy0zLjc3MywwLTYuODI3LDMuMDU3LTYuODI3LDYuODI3YzAsMy43NywzLjA1Myw2LjgyNyw2LjgyNyw2LjgyN2gzNC4xMzMgICAgYzMuNzczLDAsNi44MjctMy4wNTcsNi44MjctNi44MjdDMTc0LjA4LDkxLjgwMywxNzEuMDI3LDg4Ljc0NywxNjcuMjUzLDg4Ljc0N3oiIGZpbGw9IiMxOTllOWEiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiPjwvcGF0aD4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTI1Niw2MS40NGgtMzQuMTMzYy0zLjc3MywwLTYuODI3LDMuMDU3LTYuODI3LDYuODI3czMuMDUzLDYuODI3LDYuODI3LDYuODI3SDI1NmMzLjc3MywwLDYuODI3LTMuMDU3LDYuODI3LTYuODI3ICAgIFMyNTkuNzczLDYxLjQ0LDI1Niw2MS40NHoiIGZpbGw9IiMxOTllOWEiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiPjwvcGF0aD4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTI1Niw4OC43NDdoLTM0LjEzM2MtMy43NzMsMC02LjgyNywzLjA1Ny02LjgyNyw2LjgyN2MwLDMuNzcsMy4wNTMsNi44MjcsNi44MjcsNi44MjdIMjU2ICAgIGMzLjc3MywwLDYuODI3LTMuMDU3LDYuODI3LTYuODI3QzI2Mi44MjcsOTEuODAzLDI1OS43NzMsODguNzQ3LDI1Niw4OC43NDd6IiBmaWxsPSIjMTk5ZTlhIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik0xNjcuMjUzLDExNi4wNTNIMTMzLjEyYy0zLjc3MywwLTYuODI3LDMuMDU3LTYuODI3LDYuODI3czMuMDUzLDYuODI3LDYuODI3LDYuODI3aDM0LjEzMyAgICBjMy43NzMsMCw2LjgyNy0zLjA1Nyw2LjgyNy02LjgyN1MxNzEuMDI3LDExNi4wNTMsMTY3LjI1MywxMTYuMDUzeiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNMjU2LDExNi4wNTNoLTM0LjEzM2MtMy43NzMsMC02LjgyNywzLjA1Ny02LjgyNyw2LjgyN3MzLjA1Myw2LjgyNyw2LjgyNyw2LjgyN0gyNTZjMy43NzMsMCw2LjgyNy0zLjA1Nyw2LjgyNy02LjgyNyAgICBTMjU5Ljc3MywxMTYuMDUzLDI1NiwxMTYuMDUzeiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNMTY3LjI1MywxNDMuMzZIMTMzLjEyYy0zLjc3MywwLTYuODI3LDMuMDU3LTYuODI3LDYuODI3czMuMDUzLDYuODI3LDYuODI3LDYuODI3aDM0LjEzMyAgICBjMy43NzMsMCw2LjgyNy0zLjA1Nyw2LjgyNy02LjgyN1MxNzEuMDI3LDE0My4zNiwxNjcuMjUzLDE0My4zNnoiIGZpbGw9IiMxOTllOWEiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiPjwvcGF0aD4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTI1NiwxNDMuMzZoLTM0LjEzM2MtMy43NzMsMC02LjgyNywzLjA1Ny02LjgyNyw2LjgyN3MzLjA1Myw2LjgyNyw2LjgyNyw2LjgyN0gyNTZjMy43NzMsMCw2LjgyNy0zLjA1Nyw2LjgyNy02LjgyNyAgICBTMjU5Ljc3MywxNDMuMzYsMjU2LDE0My4zNnoiIGZpbGw9IiMxOTllOWEiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiPjwvcGF0aD4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTI5Ni45NiwxMzguNzE4Yy0zLjc3MywwLTYuODI3LDMuMDU3LTYuODI3LDYuODI3djczLjk5OWMwLDM3LjA0LTMwLjYyNiw2Ny4xNzYtNjguMjczLDY3LjE3NmgtNTQuNiAgICBjLTM3LjY0NywwLTY4LjI3My0zMC4xMzYtNjguMjczLTY3LjE3NnYtNzMuOTk5YzAtMy43Ny0zLjA1My02LjgyNy02LjgyNy02LjgyN3MtNi44MjcsMy4wNTctNi44MjcsNi44Mjd2NzMuOTk5ICAgIGMwLDQ0LjU3LDM2Ljc1Myw4MC44MjksODEuOTI3LDgwLjgyOWg1NC42YzQ1LjE3NCwwLDgxLjkyNy0zNi4yNiw4MS45MjctODAuODI5di03My45OTkgICAgQzMwMy43ODcsMTQxLjc3NSwzMDAuNzMzLDEzOC43MTgsMjk2Ljk2LDEzOC43MTh6IiBmaWxsPSIjMTk5ZTlhIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik0xOTQuNTYsMjk1LjcyOWMtMy43NzMsMC02LjgyNywzLjA1Ny02LjgyNyw2LjgyN3Y3NS4wOTNjMCwzLjc3LDMuMDUzLDYuODI3LDYuODI3LDYuODI3czYuODI3LTMuMDU3LDYuODI3LTYuODI3ICAgIHYtNzUuMDkzQzIwMS4zODcsMjk4Ljc4NiwxOTguMzMzLDI5NS43MjksMTk0LjU2LDI5NS43Mjl6IiBmaWxsPSIjMTk5ZTlhIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik0yNDkuMTczLDM3NS40NjdIMTM5Ljk0N2MtMy43NzMsMC02LjgyNywzLjA1Ny02LjgyNyw2LjgyN2MwLDMuNzcsMy4wNTMsNi44MjcsNi44MjcsNi44MjdoMTA5LjIyNyAgICBjMy43NzMsMCw2LjgyNy0zLjA1Nyw2LjgyNy02LjgyN0MyNTYsMzc4LjUyMywyNTIuOTQ3LDM3NS40NjcsMjQ5LjE3MywzNzUuNDY3eiIgZmlsbD0iIzE5OWU5YSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" />
            </nav> : <> </>}
        </>
    );
}

export default GroupSelect;