export default function getCurrentClockProvider
(currentProviderName: string): abp.timing.IClockProvider {
    if (currentProviderName === 'unspecifiedClockProvider') {
        return abp.timing.unspecifiedClockProvider;
    }

    if (currentProviderName === 'utcClockProvider') {
        return abp.timing.utcClockProvider;
    }

    return abp.timing.localClockProvider;
}
