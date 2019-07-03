<template>
    <div style="height: 600px">
        <BucketFlowGraph :data="data" />
    </div>
</template>

<script>
    import BucketFlowGraph from '../src/BucketFlowGraph';

    const generateEntities = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => ({ id: i + from, title: `${i + from}` }));

    export default {
        components: {
            BucketFlowGraph
        },
        data() {
            return {
                data: {
                    steps: [
                        {
                            title: 'Step A',
                            buckets: [
                                {
                                    title: 'Bucket 1',
                                    entities: generateEntities(1, 50),
                                    color: '#6554c0'
                                },
                                {
                                    title: 'Bucket 2',
                                    entities: generateEntities(51, 80),
                                    color: '#6554c0'
                                },
                                {
                                    title: 'Bucket 3',
                                    entities: generateEntities(81, 100),
                                    color: '#6554c0'
                                }
                            ]
                        },
                        {
                            title: 'Step B',
                            buckets: [
                                {
                                    title: 'Bucket 1',
                                    color: '#00b8d9',
                                    entities: [
                                        ...generateEntities(1, 10),
                                        ...generateEntities(51, 55)
                                    ]
                                },
                                {
                                    title: 'Bucket 2',
                                    color: '#00b8d9',
                                    entities: [
                                        ...generateEntities(11, 20),
                                        ...generateEntities(56, 70),
                                        ...generateEntities(81, 90)
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'Step C',
                            buckets: [
                                {
                                    title: 'Bucket 1',
                                    color: '#ffab00',
                                    entities: [
                                        ...generateEntities(1, 4),
                                        ...generateEntities(11, 15),
                                        ...generateEntities(95, 100)
                                    ]
                                }
                            ]
                        }
                    ]
                }
            };
        }
    };
</script>
