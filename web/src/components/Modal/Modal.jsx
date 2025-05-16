import classes from "./modal.module.css"


export default function Modal({number, has_access, features, price}) {
    return(
        <div className={classes.modal__overlay}>
            <div className={classes.modal__window}>
                <div className={classes.modal__body}>
                    <header className={classes.modal__header}>
                        {number}
                    </header>
                    <div className={classes.modal__content}>
                        <p className={classes.room__access}>
                           Имеют доступ: {has_access.map(id)}
                        </p>
                        <p className={classes.room__features}>
                            Удобства: {features.map(feature)}
                        </p>
                        <p className={room__price}>
                            {price}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
};
