<template>
    <div style="height: 600px">
        <BucketFlowGraph :data="data" :disabled-steps="disabledSteps"/>
        <div>
            <h4>Toggle steps</h4>
            <label v-for="(step, stepIndex) in steps" :key="stepIndex">
                Step {{ stepIndex + 1 }} <input v-model="steps[stepIndex]" type="checkbox" >
            </label>
        </div>
    </div>
</template>

<script>
    import BucketFlowGraph from '../src/BucketFlowGraph';

    const generateEntities = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => ({ id: i + from, title: `${i + from}` }));

    const setBuckets = (entities, from, to, obj) => entities.forEach((entity, index) => {
        if ((index + 1) >= from && (index + 1) <= to) {
            entity.buckets = { ...entity.buckets, ...obj };
        }
    });

    const entities = generateEntities(1, 80);
    setBuckets(entities, 1, 7, { bucketA: true });
    setBuckets(entities, 8, 8, { bucketB: true });
    setBuckets(entities, 9, 9, { bucketC: true });
    setBuckets(entities, 10, 14, { bucketF: true });
    setBuckets(entities, 1, 80, { bucketG: true });
    setBuckets(entities, 1, 50, { bucketH: true });
    setBuckets(entities, 51, 60, { bucketI: true });
    setBuckets(entities, 1, 20, { bucketJ: true });
    setBuckets(entities, 1, 10, { bucketK: true });
    setBuckets(entities, 1, 2, { bucketL: true });
    setBuckets(entities, 11, 11, { bucketL: true });
    setBuckets(entities, 21, 21, { bucketL: true });
    setBuckets(entities, 51, 51, { bucketL: true });

    setBuckets(entities, 15, 20, { drop: true });
    setBuckets(entities, 49, 50, { drop: true });
    setBuckets(entities, 58, 60, { drop: true });
    setBuckets(entities, 65, 80, { drop: true });

    export default {
        components: {
            BucketFlowGraph
        },
        data() {
            return {
                steps: [false, true, true, true, true],
                data: {
                    entities,
                    steps: [
                        {
                            id: 'step1',
                            title: 'Step 1',
                            scale: 'auto',
                            buckets: [
                                {
                                    title: 'Bucket A',
                                    id: 'bucketA',
                                    value: 700,
                                    color: '#6554c0'
                                },
                                {
                                    title: 'Bucket B',
                                    id: 'bucketB',
                                    value: 300,
                                    color: '#00b8d9'
                                },
                                {
                                    title: 'Bucket C',
                                    id: 'bucketC',
                                    value: 330,
                                    color: '#0052cc'
                                },
                                {
                                    title: 'Bucket D',
                                    id: 'bucketD',
                                    value: 60,
                                    color: '#ffab00'
                                },
                                {
                                    title: 'Bucket E',
                                    id: 'bucketE',
                                    value: 150,
                                    color: '#6554c0'
                                },
                                {
                                    title: 'Bucket F',
                                    id: 'bucketF',
                                    color: '#C1C7D0'
                                }
                            ]
                        },
                        {
                            id: 'step2',
                            title: 'Step 2',
                            buckets: [
                                {
                                    title: 'Bucket G',
                                    id: 'bucketG',
                                    color: '#6554c0'
                                }
                            ]
                        },
                        {
                            id: 'step3',
                            title: 'Step 3',
                            buckets: [
                                {
                                    title: 'Bucket H',
                                    id: 'bucketH',
                                    color: '#00b8d9'
                                },
                                {
                                    title: 'Bucket I',
                                    id: 'bucketI',
                                    color: '#C1C7D0'
                                }
                            ]
                        },
                        {
                            id: 'step4',
                            title: 'Step 4',
                            buckets: [
                                {
                                    title: 'Bucket J',
                                    id: 'bucketJ',
                                    color: '#0052cc'
                                }
                            ]
                        },
                        {
                            id: 'step5',
                            title: 'Step 5',
                            buckets: [
                                {
                                    title: 'Bucket K',
                                    id: 'bucketK',
                                    color: '#ffab00'
                                }
                            ]
                        },
                        {
                            id: 'step6',
                            title: 'Step 6',
                            buckets: [
                                {
                                    title: 'Bucket L',
                                    id: 'bucketL',
                                    color: '#36b37e'
                                }
                            ]
                        }
                    ]
                }
            };
        },
        computed: {
            disabledSteps() {
                return this.steps.map((value, index) => (value ? undefined : `step${index + 1}`)).filter(v => v);
            }
        }
    };
</script>
