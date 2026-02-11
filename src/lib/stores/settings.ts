import { writable } from 'svelte/store';

// Check if we are in the browser
const isBrowser = typeof window !== 'undefined';

// Get initial value from localStorage or default to false
export const initialColorBlindMode = isBrowser
    ? localStorage.getItem('colorBlindMode') === 'true'
    : false;

export const colorBlindMode = writable(initialColorBlindMode);

// Subscribe to changes and save to localStorage
if (isBrowser) {
    colorBlindMode.subscribe((value) => {
        localStorage.setItem('colorBlindMode', value.toString());
    });
}

export const standardPalette = [
    '#ffa600',
    '#ff7c43',
    '#f95d6a',
    '#d45087',
    '#a05195',
    '#665191',
    '#2f4b7c',
    '#003f5c'
];

export const colorBlindPalette = [
    '#E69F00', // Orange
    '#56B4E9', // Sky Blue
    '#009E73', // Bluish Green
    '#F0E442', // Yellow
    '#0072B2', // Blue
    '#D55E00', // Vermillion
    '#CC79A7', // Reddish Purple
    '#000000'  // Black
];
