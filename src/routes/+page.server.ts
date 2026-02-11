import { init, getServerVersion, getVersionCheck, getStorage,
     getServerStatistics, getAlbumStatistics, searchUsers, getExploreData, getAboutInfo, getServerFeatures, getServerConfig, getVersionHistory } from '@immich/sdk';
import { getDayStats } from '$lib/server/db/day/+server';
import { getWeekStats } from '$lib/server/db/week/week-stats';
import { getMonthStats } from '$lib/server/db/month/+server';
import { getYearStats } from '$lib/server/db/year/+server';
import { get5YearsStats } from '$lib/server/db/5years/+server';
import { getTotalVideoDuration, getYearlyActivityStats, getTotalAlbums } from '$lib/server/db/stats';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const IMMICH_URL = env.IMMICH_URL;
const IMMICH_API_KEY = env.IMMICH_API_KEY;

init({
    baseUrl: IMMICH_URL,
    apiKey: IMMICH_API_KEY
});

export const load: PageServerLoad = async () => {
    try {
        // Run both requests in parallel for better performance
        const [version,
               versionCheck,
               diskStorage,
               statistics,
               albumStatistics,
               searchUsers2,
               exploreData,
               dayStats,
               weekStats,
               monthStats,
               yearStats,
               fiveYearStats,
               aboutInfo,
               serverFeatures,
               serverConfig,
               versionHistory,
               totalVideoDuration,
               yearlyActivityStats,
               totalAlbums
                ] = await Promise.all([
                    getServerVersion(),
                    getVersionCheck(),
                    getStorage(),
                    getServerStatistics(),
                    getAlbumStatistics(),
                    searchUsers({}),
                    getExploreData(),
                    getDayStats(),
                    getWeekStats(),
                    getMonthStats(),
                    getYearStats(),
                    get5YearsStats(),
                    getAboutInfo(),
                    getServerFeatures(),
                    getServerConfig(),
                    getVersionHistory(),
                    getTotalVideoDuration(),
                    getYearlyActivityStats(),
                    getTotalAlbums()
        ]);

        return {
            version,
            versionCheck,
            diskStorage,
            statistics,
            albumStatistics,
            searchUsers2,
            exploreData,
            dayStats,
            weekStats,
            monthStats,
            yearStats,
            fiveYearStats,
            aboutInfo,
            serverFeatures,
            serverConfig,
            versionHistory,
            totalVideoDuration,
            yearlyActivityStats,
            totalAlbums,
            users: searchUsers2 || []
        };
    } catch (error) {
        console.error('Error connecting to Immich:', error);
        return {
            version: null,
            releaseVersion : null,
            diskStorage : null,
            statistics: null,
            albumStatistics: null,
            searchUsers2: null,
            exploreData: null,
            dayStats: null,
            fiveYearStats: null,
            error: 'Failed to connect to Immich'
        };
    }
};