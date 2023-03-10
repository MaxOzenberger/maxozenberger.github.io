import { Immutable } from 'jimu-core';
import { versionManager, DEFAULT_CONFIG } from '../src/version-manager';
let upgrader = null;
describe('Version manager test', () => {
    describe('version 1.0.0', () => {
        beforeAll(() => {
            var _a, _b;
            upgrader = (_b = (_a = versionManager.versions) === null || _a === void 0 ? void 0 : _a.filter(function (version) {
                return version.version === '1.0.0';
            })[0]) === null || _b === void 0 ? void 0 : _b.upgrader;
        });
        it('should return default config if oldConfig is undefined', () => {
            const newConfig = upgrader(null);
            expect(newConfig).toEqual(DEFAULT_CONFIG);
        });
        it('should return current config when vertical of old config is false ', () => {
            const oldConfig = Immutable({
                onlyOpenOne: false,
                displayType: 'SIDEBYSIDE',
                vertical: false,
                iconStyle: 'rectangle',
                showLabel: true,
                space: 20,
                iconSize: 'MEDIUM',
                size: {
                    widget: {
                        width: 100,
                        height: 100
                    }
                }
            });
            const newConfig = upgrader(oldConfig);
            expect(newConfig).toEqual(Immutable({
                behavior: {
                    onlyOpenOne: false,
                    openStarts: [],
                    displayType: 'SIDEBYSIDE',
                    vertical: false,
                    size: {
                        widget: {
                            width: 100,
                            height: 100
                        }
                    }
                },
                appearance: {
                    space: 0,
                    advanced: false,
                    card: {
                        showLabel: true,
                        labelGrowth: 20,
                        avatar: {
                            type: 'primary',
                            size: 'default',
                            shape: 'rectangle'
                        }
                    }
                }
            }));
        });
        it('should return current config when vertical of old config is true ', () => {
            const oldConfig = Immutable({
                onlyOpenOne: false,
                displayType: 'SIDEBYSIDE',
                vertical: true,
                iconStyle: 'rectangle',
                showLabel: true,
                space: 20,
                iconSize: 'MEDIUM',
                size: {
                    widget: {
                        width: 100,
                        height: 100
                    }
                }
            });
            const newConfig = upgrader(oldConfig);
            expect(newConfig).toEqual(Immutable({
                behavior: {
                    onlyOpenOne: false,
                    openStarts: [],
                    displayType: 'SIDEBYSIDE',
                    vertical: true,
                    size: {
                        widget: {
                            width: 100,
                            height: 100
                        }
                    }
                },
                appearance: {
                    space: 20,
                    advanced: false,
                    card: {
                        showLabel: true,
                        avatar: {
                            type: 'primary',
                            size: 'default',
                            shape: 'rectangle'
                        }
                    }
                }
            }));
        });
    });
    describe('version 1.6.0', () => {
        beforeAll(() => {
            var _a, _b;
            upgrader = (_b = (_a = versionManager.versions) === null || _a === void 0 ? void 0 : _a.filter(function (version) {
                return version.version === '1.6.0';
            })[0]) === null || _b === void 0 ? void 0 : _b.upgrader;
        });
        it('should set showTooltip as true', () => {
            const oldConfig = Immutable({
                behavior: {
                    onlyOpenOne: false,
                    openStarts: [],
                    displayType: 'SIDEBYSIDE',
                    vertical: true,
                    size: {
                        widget: {
                            width: 100,
                            height: 100
                        }
                    }
                },
                appearance: {
                    space: 20,
                    advanced: false,
                    card: {
                        showLabel: true,
                        avatar: {
                            type: 'primary',
                            size: 'default',
                            shape: 'rectangle'
                        }
                    }
                }
            });
            const newConfig = upgrader(oldConfig);
            expect(newConfig).toEqual(Immutable({
                behavior: {
                    onlyOpenOne: false,
                    openStarts: [],
                    displayType: 'SIDEBYSIDE',
                    vertical: true,
                    size: {
                        widget: {
                            width: 100,
                            height: 100
                        }
                    }
                },
                appearance: {
                    space: 20,
                    advanced: false,
                    card: {
                        showLabel: true,
                        showTooltip: true,
                        avatar: {
                            type: 'primary',
                            size: 'default',
                            shape: 'rectangle'
                        }
                    }
                }
            }));
        });
    });
});
//# sourceMappingURL=version-manager.test.js.map