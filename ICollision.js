export {ICollision}

class ICollision {
    static doOverlapRect(rec1, rec2) {
        let maxleft = Math.max(rec1[0], rec2[0]);
        let minright = Math.min(rec1[0] + rec1[2], rec2[0] + rec2[2]);
        let maxtop = Math.max(rec1[1], rec2[1]);
        let minbottom = Math.min(rec1[1] + rec1[3], rec2[1] + rec2[3]);

        return (minright > maxleft && minbottom > maxtop);
    }
}