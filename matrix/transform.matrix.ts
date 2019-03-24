import {Matrix} from "./matrix";

export class TransformMatrix {

    public Matrix = new Matrix();
    public Shift = {X: 0, Y: 0};

    public Scale(kx, ky = kx) {
        return this.Apply(TransformMatrix.Scale(kx, ky));
    }

    public Translate(x, y): TransformMatrix {
        return this.Apply(TransformMatrix.Translate(x, y));
    }

    public Inverse(): TransformMatrix {
        const result = new TransformMatrix();
        result.Matrix = this.Matrix.Inverse();
        result.Shift = (result.Matrix.Invoke(this.Shift));
        result.Shift.X *= -1;
        result.Shift.Y *= -1;
        return result;
    }

    public Apply(matrix: TransformMatrix) {
        const result = new TransformMatrix();
        const shift = this.Matrix.Invoke(matrix.Shift);
        result.Shift = {
            X: this.Shift.X + shift.X,
            Y: this.Shift.Y + shift.Y
        };
        // result.B0 = this.B0 + matrix.B0 * this.A00 + matrix.B1 * this.A01;
        // result.B1 = this.B1 + matrix.B0 * this.A10 + matrix.B1 * this.A11;
        result.Matrix = this.Matrix.Multiple(matrix.Matrix);
        return result;
    }

    public static Translate(x, y): TransformMatrix {
        const result = new TransformMatrix();
        result.Shift = {X: x, Y: y};
        return result;
    }

    public static Scale(kx, ky = kx): TransformMatrix {
        const result = new TransformMatrix();
        result.Matrix = Matrix.Scale(kx, ky);
        return result;
    }

    public static Apply(matrix1: TransformMatrix, matrix2: TransformMatrix): TransformMatrix {
        return new TransformMatrix().Apply(matrix1).Apply(matrix2);
    }

    public toString() {
        if (this.Matrix.IsIdentity()) {
            return this.ToTranslate();
        }
        return `matrix(${this.Matrix.toString() + ', ' + this.Shift.X + ', ' + this.Shift.Y})`;
        // return this.Matrix.ToString();
    }

    public ToTranslate3d() {
        return 'translate3d(' + this.Shift.X + 'px,' + this.Shift.Y + 'px, 0)';
    }

    public ToTranslate() {
        return 'translate(' + this.Shift.X + ',' + this.Shift.Y + ')';
    }

    public ToScale() {
        return 'scale(' + this.Matrix + ')';
    }

    public ToScaleTranslate() {
        return this.ToScale() + ' ' + this.ToTranslate3d();
    }

}
